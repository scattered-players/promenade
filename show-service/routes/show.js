const crypto = require('crypto');
const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { Show, Place, Party, Phase } = require('../models');
const {
  broadcastAudioCue,
  broadcastCue,
  clearDecider,
  validateDecider,
  refreshSystemState,
  refreshCurrentShowState
} = require('../util/operations');
const {
  startShow,
  stopShow
} = require('../util/janus');
const {
  sendShowEmails
} = require('../util/sendgrid');
const {
  createExpiringToken
} = require('../util/auth');
const {
  SITE_BASE_URL
} = require('../secrets/credentials');
const {
  STREAM_SECRET
} = require('../secrets/promenade-config');

/* GET shows listing. */
router.get('/', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let showList = await Show.find();
  console.log('SHOWS', showList);
  res.json(showList);
}));

/* GET full state. */
router.get('/full', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let showList = await Show.getTotalState();
  console.log('SHOWS', showList);
  res.json(showList);
}));

/* GET current show state. */
router.get('/current', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let currentShow = await Show.getCurrentShowState();
  console.log('SHOW', currentShow);
  res.json(currentShow);
}));

/* POST schedule a new show. */
router.post('/', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let { date, numParties } = req.body;
  date = new Date(date);
  numParties = numParties || 6;
  let newShow = await Show.scheduleShow(date, numParties);
  res.json(newShow);
  refreshSystemState();
}));

/* PUT update a show's info */
router.put('/info', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  
  let { showId, date, isEventbrite } = req.body;
  await Show.updateOne({ _id: showId}, { date, isEventbrite });

  res.sendStatus(200);

  refreshSystemState();
}));

/* POST send an audio cue */
router.post('/audiocue', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  
  let { audioPath } = req.body;
  broadcastAudioCue(audioPath);
  res.sendStatus(200);
}));

/* POST send an audio cue */
router.post('/cue', asyncHandler(async (req, res, next) => {
  // if(req.userKind !== 'Admin') {
  //   return res.sendStatus(403);
  // }
  let cue = req.body;
  broadcastCue(cue);
  res.sendStatus(200);
}));

/* DELETE delete a show. */
router.delete('/:showId', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }

  let { showId } = req.params;
  await Show.deleteShow(showId);

  res.sendStatus(200);

  refreshSystemState();
  refreshCurrentShowState();
}));

/* GET email CSV */
router.get('/loginEmailCsv/:showId', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }

  let { showId } = req.params;
  let show = await Show.findById(showId);
  if(!show) {
    return res.sendStatus(404);
  }
  show = await show.getCurrentState();
  const formatter = new Intl.DateTimeFormat([], {
    timeZone: "America/New_York",
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric'
  });
  const showtime = formatter.format(new Date(show.date));
  let emailInfo = show.parties.flatMap(party => party.attendees.map(attendee => ({
    email: attendee.email,
    username: attendee.username,
    showtime,
    ship: party.name,
    loginurl: `${SITE_BASE_URL}/attendee/?token=${createExpiringToken(attendee, '120h')}`
  })));
  res.json(emailInfo);
}));

/* GET stream key*/
router.get('/streamkey/:showId', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }

  let { showId } = req.params;
  let show = await Show.findById(showId);
  if(!show) {
    return res.sendStatus(404);
  }
  
  const streamName = show._id
  const exptime = Math.round(Date.now()/1000) + 86400;
  let hash = crypto.createHash('md5').update(`/live/${streamName}-${exptime}-${STREAM_SECRET}`).digest("hex");
  let sign = `${exptime}-${hash}`;
  let streamKey = `${streamName}?sign=${sign}`;
  res.json({streamKey});
}));

/* POST send emails to all attendees */
router.post('/loginEmail/:showId', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }

  let { showId } = req.params;
  let show = await Show.findById(showId);
  if(!show) {
    return res.sendStatus(404);
  }
  show = await show.getCurrentState();
  res.json(await sendShowEmails(show));
}));

/* PUT change show status */
router.put('/status', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let { showId, state } = req.body;
  let [
    show,
    newPhase
  ] = await Promise.all([
    Show.findById(showId).populate([
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
            path:'guide',
          }
        ]
      }
    ]),
    Phase.findById(state).lean()
  ]);
  if(!show){
    throw `No show with ID "${showId}"`;
  }

  let promises = [];
  if(newPhase.kind === 'FREEPLAY' && show.isRunning) {
    promises = promises.concat(
      show.parties.map(async party => {
        await clearDecider(party);
        await validateDecider(party);
      })
    );
  } else if (newPhase.kind !== 'FREEPLAY' && show.currentPhase.kind === 'FREEPLAY'){
    promises.push((async () => {
      await Party.updateMany({}, { $set: { currentPlace: null, nextPlace: null, selectedPlace: null }});
      await Promise.all(show.parties.map(clearDecider))
    })());
    promises = promises.concat(
      Place.updateMany({}, {$set:{
        currentParty: null,
        partyQueue: []
      }})
    );
  }
  let $set = { currentPhase: newPhase._id };

  promises.push(Show.updateOne({_id: showId}, {$set}));
  await Promise.all(promises);
  res.json(show);

  refreshSystemState();
  refreshCurrentShowState();
}));

/* PUT start/stop shows */
router.put('/run', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let { showId, isRunning } = req.body;
  let [currentShow, runningShows] = await Promise.all([
    Show.findById(showId).populate({
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
          path:'guide',
        }
      ]
    }).lean(),
    Show.find({isRunning: true}).populate({
      path: 'parties'
    }).lean()
  ]);

  runningShows = runningShows.filter(show => show._id !== showId);
  let promises = [
    ...runningShows.map(stopShow),
    ...runningShows.map(async show => await Promise.all(show.parties.map(clearDecider)))
  ];

  let currentShowModificatons = { $set: { isRunning }};
  if(currentShow.isRunning && !isRunning) {
    promises.push(stopShow(currentShow));
  } else if(!currentShow.isRunning && isRunning) {
    promises.push(startShow(currentShow));
    if(currentShow.currentPhase.kind === 'FREEPLAY') {
      promises = promises.concat(
        currentShow.parties.map(async party => {
          await clearDecider(party);
          await validateDecider(party);
        })
      )
    }
  }

  promises.push(Show.updateMany({}, { $set: { isRunning: false}}));
  promises.push(Place.updateMany({}, { $set: { currentParty: null, partyQueue: [] }}));
  promises.push(Party.updateMany({}, { $set: { currentPlace: null, nextPlace: null, selectedPlace: null }}));
  await Promise.all(promises);
  promises = [];
  if(isRunning){
    promises.push(Show.updateOne({ _id: showId }, currentShowModificatons));
  }
  await Promise.all(promises);
  res.json(currentShow);

  refreshSystemState();
  refreshCurrentShowState();
}));

module.exports = router;
