const _ = require('lodash');
const { v4:uuid } = require('uuid');
const {
  Actor,
  Admin,
  Attendee,
  Attendance,
  Guide,
  Show,
  Phase,
  Place,
  Party,
  User,
  Scene
} = require('../models');

const {
  wssAdmin,
  wssActor,
  wssAttendee,
  wssGuide
} = require('../ws/servers');

const {
  janusCoefficient,
  kickUser,
  listUsers
} = require('./janus');

const {
  delay
} = require('./misc');

const {
  broadcastAdmin,
  broadcastActor,
  broadcastAttendee,
  broadcastAll,
  broadcastGuide,
  sendMessageToUser
} = require('../ws/broadcast');


const env = process.env.NODE_ENV || 'development';

async function disconnectUser(userId) { 
  wssAdmin.clients.forEach(ws => {
    if(ws.userId === userId) {
      ws.close();
    }
  })
  wssActor.clients.forEach(ws => {
    if(ws.userId === userId) {
      ws.close();
    }
  })
  wssAttendee.clients.forEach(ws => {
    if(ws.userId === userId) {
      ws.close();
    }
  })
}

function broadcastAudioCue(audioPath) {
  setImmediate(() => {
    broadcastAttendee({
      type:'RECEIVE_AUDIO_CUE',
      audioPath
    });
    broadcastGuide({
      type:'RECEIVE_AUDIO_CUE',
      audioPath
    });
  })
}

function broadcastCue(cue) {
  setImmediate(() => {
    broadcastActor({
      type:'RECEIVE_CUE',
      cue
    });
    broadcastAttendee({
      type:'RECEIVE_CUE',
      cue
    });
    broadcastGuide({
      type:'RECEIVE_CUE',
      cue
    });
  })
}

async function broadcastLogin(body) {
  body.id = uuid();
  body.timestamp = Date.now();
  setImmediate(() => {
    broadcastAdmin({
      type:'REPORT_LOGIN',
      body
    });
  })
}

async function broadcastError(body) {
  body.id = uuid();
  body.timestamp = Date.now();
  setImmediate(() => {
    broadcastAdmin({
      type:'REPORT_ERROR',
      body
    });
  });
}

async function broadcastSlowlink(body) {
  body.id = uuid();
  body.timestamp = Date.now();
  setImmediate(() => {
    broadcastAdmin({
      type:'REPORT_SLOWLINK',
      body
    });
  });
}

let hasQueuedRefreshingSystemState = false;
let isCurrentlyRefreshingSystemState = false;
const refreshSystemState = _.debounce(async function() {
  if(isCurrentlyRefreshingSystemState && hasQueuedRefreshingSystemState) {
    return;
  } else if(isCurrentlyRefreshingSystemState && !hasQueuedRefreshingSystemState) {
    hasQueuedRefreshingSystemState = true;
    while(isCurrentlyRefreshingSystemState){
      console.log('QUEUEING FOR TOTAL SHOW STATE');
      await delay(500);
    }
    hasQueuedRefreshingSystemState = false;
  }
  isCurrentlyRefreshingSystemState = true;
  try {
    let startTime = Date.now();
    let [
      shows,
      actors,
      admins,
      attendees,
      guides,
      scenes,
      phases
    ] = await Promise.all([
      Show.getTotalState(),
      Actor.find().populate({
        path: 'place',
        populate: [
          {
            path: 'currentParty'
          },
          {
            path: 'partyQueue'
          }
        ]
      }).lean(),
      Admin.find().lean(),
      Attendee.find().lean(),
      Guide.find().lean(),
      Scene.find().populate([{
        path: 'place'
      },{
        path: 'party'
      }]).lean(),
      Phase.find().sort({ index: 'asc' }).lean()
    ]);
    broadcastAdmin({
      type:'RECEIVE_SYSTEM_STATE',
      body: {
        shows,
        actors,
        admins,
        attendees,
        guides,
        scenes,
        phases,
        pullTime: (Date.now() - startTime) / 1000,
        adminSockets: wssAdmin.clients.size,
        actorSockets: wssActor.clients.size,
        attendeeSockets: wssAttendee.clients.size,
        guideSockets: wssGuide.clients.size,
        janusCoefficient
      }
    });
    isCurrentlyRefreshingSystemState = false;
  } catch(e){
    console.log('UHOH on refreshSystemState', e);
    isCurrentlyRefreshingSystemState = false;
  }
},100);


let hasQueuedRefreshingCurrentShowState = false;
let isCurrentlyRefreshingCurrentShowState = false;
const refreshCurrentShowState = _.debounce(async function () {
  if(isCurrentlyRefreshingCurrentShowState && hasQueuedRefreshingCurrentShowState) {
    return;
  } else if(isCurrentlyRefreshingCurrentShowState && !hasQueuedRefreshingCurrentShowState) {
    hasQueuedRefreshingCurrentShowState = true;
    while(isCurrentlyRefreshingCurrentShowState){
      console.log('QUEUEING FOR CURRENT SHOW STATE');
      await delay(500);
    }
    hasQueuedRefreshingCurrentShowState = false;
  }
  isCurrentlyRefreshingCurrentShowState = true;
  try {
    let startTime = Date.now();
    let [
      currentShow,
      places,
      phases
    ] = await Promise.all([
      Show.getCurrentShowState(),
      Place.getCurrentPlaceState(),
      Phase.find().sort({ index: 'asc' }).lean()
    ]);
    broadcastAll({
      type:'RECEIVE_CURRENT_SHOW_STATE',
      body: {
        janusCoefficient,
        currentShow,
        places,
        phases,
        pullTime: (Date.now() - startTime) / 1000
      }
    });
    isCurrentlyRefreshingCurrentShowState = false;
  } catch(e){
    console.log('UHOH on refreshCurrentShowState', e);
    isCurrentlyRefreshingCurrentShowState = false;
  }
}, 100);

async function updateUsersBookedShows(userId){
  let attendances = await Attendance.find({ attendee: userId });
  let bookedShows = await Show.find().where('_id').in(attendances.map(attendance => attendance.show));
  sendMessageToUser(userId, {
    type:'RECEIVE_BOOKED_SHOWS',
    body: {
      bookedShows
    }
  })
}

function forceRefreshUser(userId){
  sendMessageToUser(userId, {
    type:'FORCE_REFRESH'
  })
}

const deciderTimeouts = {};
async function clearDecider(party) {
  if(deciderTimeouts[party._id]){
    clearTimeout(deciderTimeouts[party._id]);
    delete deciderTimeouts[party._id];
  }
  await Party.updateOne({_id: party._id}, { $set: {decider: null, decisionDeadline: null, guideIsDeciding: false }});
  party.decider = null;
  party.decisionDeadline = null;
  return party;
}

const DECISION_TIME_LIMIT = (env === 'development') ? 60 * 60 * 1000 : 30 * 1000;
async function setDecider(party) {
  if(!!party.guide && party.guide.isOnline){
    await Party.updateOne({_id: party._id}, { $set: { decider: null, decisionDeadline: null, guideIsDeciding: true }})
  } else {
    let candidates = _.shuffle(party.attendances.filter(attendance => attendance.attendee.isOnline));
    if(candidates.length) {
      const decider = candidates[0]._id,
        decisionDeadline = Date.now() + DECISION_TIME_LIMIT;
        if(deciderTimeouts[party._id]){
          clearTimeout(deciderTimeouts[party._id]);
        }
        deciderTimeouts[party._id] = setTimeout(() => decide(party), DECISION_TIME_LIMIT)
      await Party.updateOne({_id: party._id}, { $set: { decider, decisionDeadline, guideIsDeciding: false }})
    }
  }
}

async function decide(party){
  console.log('DECIDING!');
  delete deciderTimeouts[party._id];
  const places = await Place.getCurrentPlaceState();
  let candidates = _.shuffle(places.filter(place => place.isAvailable && place.currentParty === null && place.partyQueue.length === 0 && !party.history.reduce((acc, histPlace) => acc || histPlace._id === place._id, false)));
  if(!candidates.length){
    candidates = _.shuffle(places.filter(place => place.isAvailable && place.currentParty === null && place.partyQueue.length === 0));
  }

  if(candidates.length){
    await queueParty(party, candidates[0]);
  } else {
    await clearDecider(party);
    await setDecider(await Party.findById(party._id).populate([
      {
      path:'attendances',
      populate: {
        path: 'attendee',
      }
    },
    {
      path: 'guide'
    }
  ]).lean());
  }

  refreshSystemState();
  refreshCurrentShowState();
}

async function validateDecider(party) {
  if(party.currentPlace || party.nextPlace) {
    if(party.decider || party.decisionDeadline){
      await clearDecider(party);
    }
    return;
  }

  if (party.decider && (!party.decider.attendee.isOnline || party.decisionDeadline < Date.now())) {
    party = await clearDecider(party);
  }

  if (!!party.guide && !!party.guide.isOnline && !party.guideIsDeciding) {
    party = await clearDecider(party);
  }

  if ((!party.guide || !party.guide.isOnline) && party.guideIsDeciding) {
    party = await clearDecider(party);
  }

  if(!party.decider) {
    await setDecider(party);
  }
  return;
}

async function queueParty(party, place){
  let promises = [];
  if (party.nextPlace) {
    promises.push(Place.updateOne({ _id: party.nextPlace }, { $pull: { partyQueue: party._id } }));
  }
  if (party.currentPlace) {
    promises.push(Place.updateOne({ _id: party.currentPlace }, { $set: { currentParty: null } }));
  }
  promises.push(Party.updateOne({ _id: party._id }, { $set: { selectedPlace: place._id, nextPlace: place._id, currentPlace: null } }));
  promises.push(Place.updateOne({ _id: place._id }, { $push: { partyQueue: party._id } }));
  promises.push(clearDecider(party));
  await Promise.all(promises);
}

async function kickParty(party, place) {
  let modifications = {
    $set: {
      currentFilter: null
    }
  };
  if(place.currentParty && (place.currentParty.toString() === party._id.toString() || (place.currentParty._id && place.currentParty._id.toString() === party._id.toString()))) {
    modifications['$set'].currentParty = null;
  }
  if(place.partyQueue.reduce((acc, qParty) => acc || qParty.toString() === party._id.toString() || (qParty._id && qParty._id.toString() === party._id.toString()), false)) {
    modifications['$pull'] = { partyQueue: party._id };
  }
  console.log('KICKING PLACE', { _id: place._id}, modifications);
  let [matchingScenes] = await Promise.all([
    Scene.find({ party:party._id, place: place._id }).lean(),
    Place.updateOne({ _id: place._id}, modifications),
    Party.updateOne({ _id: party._id }, { $set: { currentPlace: null, nextPlace: null, selectedPlace: null } })
  ]);

  matchingScenes = matchingScenes.filter(scene => !scene.endTime);
  if(matchingScenes.length) {
    let lastScene = matchingScenes.pop();
    console.log('UPDATE SCENE!', lastScene);
    await Scene.updateOne({_id: lastScene._id}, { $set: { endTime: new Date() } });
  }

  await setDecider(await Party.findById(party._id).populate([
    {
      path:'attendances',
      populate: {
        path: 'attendee'
      }
    },
    {
      path:'guide'
    }
  ]).lean());
}

async function blockUser(userId) {
  await Attendee.updateOne({_id: userId}, {isBlocked: true});
  let show = await Show.getCurrentShowState();
  if(show) {
    let matchingParties = show.parties.filter(party => party.attendances.reduce((acc,attendance) => acc || attendance.attendee._id.toString() === userId, false));
    if(matchingParties.length){
      let listUserResult = await listUsers(matchingParties[0].janusIndex, matchingParties[0]._id);
      let matchingUsers = listUserResult.plugindata.data.participants.filter(participant => participant.display === `attendee:${userId}`);
      if(matchingUsers.length) {
        await kickUser(matchingParties[0].janusIndex, matchingParties[0]._id, matchingUsers[0].id);
      }
    }
  }
  setTimeout(() => {
    wssAttendee.clients.forEach(ws => {
      if(ws.userId === userId) {
        ws.close();
      }
    })
  }, 1000);
}

async function defaultPhases() {
  let phases = await Phase.find({}).lean();
  if(!phases.length) {
    await Phase.create({
      name:"Start",
      kind:"WEB_PAGE",
      attributes: {
        url: 'https://www.example.com'
      },
      index: 0,
      isDefault: true
    });
    await Phase.create({
      name:"Intro",
      kind:"STATIC_VIDEO",
      attributes: {
        url: 'https://cdn.chrisuehlinger.com/yknow.mp4'
      },
      index: 1,
      isDefault: false
    });
    await Phase.create({
      name:"End",
      kind:"KICK",
      index: 2,
      isDefault: false
    });
    console.log('DEFAULT PHASES CREATED');
  }
}

async function startup() {
  let promises = [];
  promises.push((async () => {
    await defaultPhases();
    // await syncWithEventbrite();
  })());
  promises.push(User.updateMany({}, { $set: { isOnline: false }}));
  promises.push(Party.updateMany({}, { $set: { decider: null, decisionDeadline: null, decisionTimeoutId: null, currentPlace: null, nextPlace: null, selectedPlace: null }}));
  promises.push(Place.updateMany({}, { $set: { currentParty: null, partyQueue: [] }}));
  promises.push((async () => {
    let attendees = await Attendee.find({});
    await Promise.all(
      attendees
        .filter(attendee => attendee.email.endsWith('loadtest.com'))
        .map(async attendee => {
          await Attendance.deleteMany({ attendee: attendee._id });
          await Attendee.deleteOne({ _id: attendee._id });
        })
    );
  })());
  promises.push((async () => {
    let actors = await Actor.find({});
    await Promise.all(
      actors
        .filter(actor => actor.username.startsWith('actor'))
        .map(async actor => {
          await Place.deleteOne({ _id: actor.place });
          await Actor.deleteOne({ _id: actor._id });
        })
    );
  })());
  await Promise.all(promises);

  // WARNING: UNCOMMENTING THIS CODE WILL DELETE ALL EVENTBRITE EVENTS AND USERS. IF YOU DO THIS, ANY LOGIN LINKS WE HAVE EMAILED WILL NO LONGER WORK.
  //
  // let showsToDelete = await Show.find({isEventbrite: true}).lean();
  // await Show.updateMany({isEventbrite: true}, {$set:{isEventbrite: false}});
  // await Promise.all(showsToDelete.map(async show => await Show.deleteShow(show._id)));
  // let allAttendees = await Attendee.find({});
  // await Promise.all(allAttendees.map(async attendee => {
  //   let attendances = await Attendance.find({attendee: attendee._id});
  //   if(attendances.length === 0) {
  //     await Attendee.deleteOne({_id: attendee._id});
  //   }
  // }));
}

module.exports = {
  broadcastAudioCue,
  broadcastCue,
  broadcastLogin,
  broadcastError,
  broadcastSlowlink,
  refreshSystemState,
  refreshCurrentShowState,
  updateUsersBookedShows,
  forceRefreshUser,
  disconnectUser,
  clearDecider,
  setDecider,
  validateDecider,
  queueParty,
  kickParty,
  blockUser,
  startup
}