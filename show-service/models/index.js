const { v4:uuid } = require('uuid');
const _ = require('lodash');
const { mongoose } = require('../util/db');
const userSchema = require('../schemas/user');
const actorSchema = require('../schemas/actor');
const adminSchema = require('../schemas/admin');
const attendanceSchema = require('../schemas/attendance');
const attendeeSchema = require('../schemas/attendee');
const guideSchema = require('../schemas/guide');
const itemSchema = require('../schemas/item');
const messageSchema = require('../schemas/message');
const partySchema = require('../schemas/party');
const placeSchema = require('../schemas/place');
const phaseSchema = require('../schemas/phase');
const showSchema = require('../schemas/show');
const sceneSchema = require('../schemas/scene');
const botSchema = require('../schemas/bot');

const {
  startShow,
  stopShow
} = require('../util/janus');

/* STATIC METHODS */

const { DEFAULT_PARTIES, ENDING_TYPE } = require('../secrets/promenade-config.json');

showSchema.statics.scheduleShow = async function(showDate, numParties, isEventbrite=false,
    eventBriteId) {

  let startPhase = await Phase.findOne({ isDefault: true });
  let videoChoicePhases = await Phase.find({ kind: 'VIDEO_CHOICE'});
  let parties = [];
  for(let i = 0; i < numParties; i++){
    let newParty = new Party({
      name: DEFAULT_PARTIES[i].name,
      color: DEFAULT_PARTIES[i].color,
      currentPlace: null,
      selectedPlace: null,
      nextPlace: null,
      attendances: [],
      inventory: [],
      chat:[],
      guide: null,
      guideIsDeciding: false,
      janusIndex: i,
      history: [],
      decider: null,
      decisionDeadline: null,
      decisionTimeoutId: null,
      notes: '',
      videoChoices: videoChoicePhases.map(phase => ({ phase: phase._id, choiceURL: phase.attributes.videoList[0]}))
    });
    parties.push(newParty);
    await Promise.all(DEFAULT_PARTIES[i].items.map(async name => {
      let newItem = await Item.create({
        name,
        isAnsiblePart: true
      })
      newParty.inventory.push(newItem._id);
    }));
    await newParty.save();
  }
  return await this.create({
    date: showDate,
    isEventbrite,
    parties: parties.map(party => party._id),
    currentPhase: startPhase,
    isRunning: false,
    eventBriteId: eventBriteId,
    endingType: ENDING_TYPE
  });
};

attendanceSchema.statics.bookTicket = async function(attendeeEmail, showId, username=null) {
  let [show, attendee] = await Promise.all([
    Show.findById(showId).populate({
      path:'parties'
    }),
    Attendee.findOne({ email: attendeeEmail })
  ]);

  if(!show){
    throw `No show with ID: '${showId}'`;
  }

  if(!attendee) {
    attendee = await Attendee.create({
      email: attendeeEmail,
      username: (username && username.length) ? username : attendeeEmail.split('@')[0],
      isOnline: false,
      isBlocked: false,
      isAudioMuted: false,
      isVideoMuted: false
    });
  }

  let attendance = await show.addAttendee(attendee);
  return attendance;
};

attendanceSchema.statics.deleteTicket = async function(attendeeEmail, showId) {
  let [show, attendee] = await Promise.all([
    Show.findById(showId),
    Attendee.findOne({ email: attendeeEmail })
  ]);

  if(!show){
    throw `No show with ID: '${showId}'`;
  }

  if(!attendee) {
    throw `No attendee with email: '${email}'`;
  }

  await show.removeAttendee(attendee);
  return attendee;
};

showSchema.statics.getTotalState = async function(){
  let shows = await this.find()
  .populate([
    {
      path: 'currentPhase'
    },
    {
      path: 'parties',
      populate: [
        {
          path:'attendances',
          populate: {
            path: 'attendee'
          }
        },
        {
          path:'decider',
          populate: {
            path: 'attendee'
          }
        },
        {
          path:'guide'
        },
        {
          path:'currentPlace'
        },
        {
          path:'nextPlace'
        },
        {
          path:'selectedPlace'
        },
        {
          path:'history'
        },
        {
          path: 'inventory'
        },
        {
          path: 'chat'
        },
        {
          path:'videoChoices',
          populate: {
            path: 'phase'
          }
        }
      ]
    }
  ])
  .lean();
  shows.map(show => {
    show.parties.map(party => {
      party.attendees = party.attendances.map(attendance => attendance.attendee)
    });
  })
  return shows;
}

showSchema.statics.deleteShow = async function(showId){
  let show = await this.findById(showId)
    .populate({
      path: 'parties'
    })
    .lean();

  if(!show){
    throw `No show exists with ID "${showId}"`;
  }

  if(show.isEventbrite) {
    throw 'Cannot delete Eventbrite shows';
  }

  if (show.isRunning) {
    await stopShow(show);
  }

  await Promise.all([
    Item.deleteMany({ _id: { $in: show.parties.flatMap(party => party.inventory ) }}),
    Message.deleteMany({ _id: { $in: show.parties.flatMap(party => party.chat ) }}),
    Attendance.deleteMany({ _id: { $in: show.parties.flatMap(party => party.attendances )}}),
    Party.deleteMany({ _id: { $in: show.parties.map(party => party._id )}}),
    Scene.deleteMany({ party: { $in: show.parties.flatMap(party => party._id) }}),
    Show.deleteOne({ _id: showId })
  ]);

  return 
}

showSchema.statics.getCurrentShowState = async function() {
  let show = await this.findOne({ isRunning: true })
    .populate([
      {
        path: 'currentPhase'
      },
      {
        path: 'parties',
        populate: [
          {
            path:'attendances',
            populate: {
              path: 'attendee',
              select: '-email'
            }
          },
          {
            path:'decider',
            populate: {
              path: 'attendee',
              select: '-email'
            }
          },
          {
            path:'guide'
          },
          {
            path:'currentPlace'
          },
          {
            path:'nextPlace'
          },
          {
            path:'selectedPlace'
          },
          {
            path:'history'
          },
          {
            path: 'inventory'
          },
          {
            path: 'chat'
          },
          {
            path:'videoChoices',
            populate: {
              path: 'phase'
            }
          }
        ]
      }
    ])
    .lean();

  if(show){
    show = JSON.parse(JSON.stringify(show));
    show.parties.map(party => {
      party.attendees = party.attendances.map(attendance => attendance.attendee);
    })
  }

  return show;
}

placeSchema.statics.getCurrentPlaceState = async function() {
  let [bots, actors] = await Promise.all([
    Bot.find({ isOnline: true}).populate({
      path: 'places',
      populate: [
        {
          path: 'currentParty',
          populate: [
            {
              path:'attendances',
              populate: {
                path: 'attendee',
                select: '-email'
              }
            },
            {
              path:'guide'
            },
            {
              path: 'inventory'
            },
            {
              path: 'history'
            },
            {
              path: 'chat'
            }
          ]
        },
        {
          path:'partyQueue',
          populate: [
            {
              path:'attendances',
              populate: {
                path: 'attendee',
                select: '-email'
              }
            },
            {
              path:'guide'
            },
            {
              path: 'inventory'
            },
            {
              path: 'history'
            },
            {
              path: 'chat'
            }
          ]
        },
        {
          path: 'phase'
        }
      ]
    }).lean(),
    Actor.find({ isOnline: true }).populate({
      path: 'places',
      populate: [
        {
          path: 'currentParty',
          populate: [
            {
              path:'attendances',
              populate: {
                path: 'attendee',
                select: '-email'
              }
            },
            {
              path:'guide'
            },
            {
              path: 'inventory'
            },
            {
              path: 'history'
            },
            {
              path: 'chat'
            }
          ]
        },
        {
          path:'partyQueue',
          populate: [
            {
              path:'attendances',
              populate: {
                path: 'attendee',
                select: '-email'
              }
            },
            {
              path:'guide'
            },
            {
              path: 'inventory'
            },
            {
              path: 'history'
            },
            {
              path: 'chat'
            }
          ]
        },
        {
          path: 'phase'
        }
      ]
    }).lean()
  ]);
  let places = _.flatMap(actors, actor => actor.places);
  places = places.concat(_.flatMap(bots, bot => bot.places));
  places.map(place => {
    if(place.currentParty){
      place.currentParty.attendees = place.currentParty.attendances.map(attendance => attendance.attendee);
    }
  });

  return places;
}

/* INSTANCE METHODS */

attendeeSchema.methods.getAttendances = async function() {
  return await Attendance.find({ attendee: this._id })
}

attendeeSchema.methods.getShows = async function() {
  let attendances = await this.getAttendances();
  let shows = await Show.find().where('_id').in(attendances.map(attendance => attendance.show));
  return shows;
}

showSchema.methods.getCurrentState = async function(scrubEmails=true) {
  let show = await this
    .populate([
      {
        path: 'currentPhase'
      },
      {
        path: 'parties',
        populate: [
          {
            path:'attendances',
            populate: {
              path: 'attendee',
              select: scrubEmails ? undefined : '-email'
            }
          },
          {
            path:'decider',
            populate: {
              path: 'attendee',
              select: scrubEmails ? undefined : '-email'
            }
          },
          {
            path:'guide'
          },
          {
            path:'currentPlace'
          },
          {
            path:'nextPlace'
          },
          {
            path:'selectedPlace'
          },
          {
            path:'history'
          },
          {
            path: 'inventory'
          },
          {
            path: 'chat'
          },
          {
            path:'videoChoices',
            populate: {
              path: 'phase'
            }
          }
        ]
      }
    ])
    .execPopulate();
  
  show.parties.map(party => {
    party.attendees = party.attendances.map(attendance => attendance.attendee);
  })
  return show;
}

showSchema.methods.addAttendee = async function(attendee) {
  let partyId = null;
  let numTries = 0;
  let existingAttendance = await Attendance.findOne({ show:this._id, attendee:attendee._id })
  if(!!existingAttendance) {
    console.error(`Attendee ${attendee._id} already has an attendance at this show`);
    return existingAttendance;
  }
  let attendance = await Attendance.create({});
  while (!partyId){
    numTries++;
    await this.populate('parties').execPopulate();
    let parties = _.shuffle(this.parties);
    let indexOfSmallestParty = 0;
    // console.log(parties)
    for(let i = 0; i < parties.length; i++) {
      if(parties[i].attendances.length < parties[indexOfSmallestParty].attendances.length) {
        indexOfSmallestParty = i;
      }
    }
    let smallestParty = parties[indexOfSmallestParty];
    if(smallestParty.attendances.length >= 5){
      throw 'This show is already fully booked';
    }
    let record = await Party.findOneAndUpdate({ _id: smallestParty._id, attendances: { $size:smallestParty.attendances.length }}, {attendances: [...smallestParty.attendances, attendance._id]});
    console.log('TRIED TO PLACE IN PARTY', record);
    if(record) {
      partyId = record._id
    }
  }
  console.log('NUM TRIES', numTries);
  attendance.attendee = attendee._id
  attendance.show = this._id;
  attendance.party = partyId;
  await attendance.save();

  return attendance;
}

showSchema.methods.removeAttendee = async function(attendee) {
  let attendance = await Attendance.findOne({ attendee: attendee._id, showId: this._id});
  let party = await Party.findById(attendance.party);

  if (!party) {
    throw `No party containing attendance with ID: ${attendance.attendanceId}`;
  }

  party.attendances = party.attendances.filter(partyAttendance => partyAttendance !== attendance.attendee);
  await Promise.all([
    party.save(),
    Attendance.deleteOne({ _id: attendance._id })
  ]);

  return;
}

/* MODEL DEFINITIONS */

var User = mongoose.model('User', userSchema);

var Actor = User.discriminator('Actor', actorSchema);
var Admin = User.discriminator('Admin', adminSchema);
var Attendee = User.discriminator('Attendee', attendeeSchema);
var Guide = User.discriminator('Guide', guideSchema);

var Attendance = mongoose.model('Attendance', attendanceSchema);
var Item = mongoose.model('Item', itemSchema);
var Message = mongoose.model('Message', messageSchema);
var Party = mongoose.model('Party', partySchema);
var Place = mongoose.model('Place', placeSchema);
var Show = mongoose.model('Show', showSchema);
var Scene = mongoose.model('Scene', sceneSchema);

var Phase = mongoose.model('Phase', phaseSchema);
var Bot = mongoose.model('Bot', botSchema);

module.exports = {
  User,
  Actor,
  Admin,
  Attendee,
  Attendance,
  Guide,
  Item,
  Message,
  Party,
  Phase,
  Place,
  Show,
  Scene,
  Bot
};