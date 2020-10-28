const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router();
const { SHOW_RUNTIME } = require('../constants');

const {
  createAndStart,
  runShow
} = require('../util/show-runner')

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

let ready, i, currentShow, resetTimeout, actors, attendees, currentProfile;
function reset() {
  ready = false;
  i = 0;
  currentShow = null;
  actors = [];
  attendees = [];
}
reset();

/* GET if we're ready to hand out actors. */
router.get('/redirect/actor', (req, res) => {
  if(ready && actors.length){
    let thisActor = actors.pop();
    res.redirect(`https://shattered.site/actor/?token=${thisActor.token}`)
    if(!actors.length && !attendees.length) {
      clearTimeout(resetTimeout);
      reset();
    }
  } else {
    res.sendStatus(404);
  }
});

/* GET if we're ready to hand out attendees. */
router.get('/redirect/attendee', (req, res) => {
  if(ready && attendees.length){
    let thisAttendee = attendees.pop();
    res.redirect(`https://shattered.site/attendee/?token=${thisAttendee.token}`)
    if(!actors.length && !attendees.length) {
      clearTimeout(resetTimeout);
      reset();
    }
  } else {
    res.sendStatus(404);
  }
});

/* GET if we're ready to hand out actors. */
router.get('/ready/actor', (req, res) => {
  if(ready && actors.length){
    let thisActor = actors.pop();
    res.json({
      type: 'actor',
      token: thisActor.token,
      profile: currentProfile
    });
    if(!actors.length && !attendees.length) {
      clearTimeout(resetTimeout);
      reset();
    }
  } else {
    res.sendStatus(404);
  }
});

/* GET if we're ready to hand out attendees. */
router.get('/ready/attendee', (req, res) => {
  if(ready && attendees.length){
    let thisAttendee = attendees.pop();
    res.json({
      type: 'attendee',
      token: thisAttendee.token,
      profile: currentProfile
    });
    if(!actors.length && !attendees.length) {
      clearTimeout(resetTimeout);
      reset();
    }
  } else {
    res.sendStatus(404);
  }
});

/* GET if we're ready to hand out anything. */
router.get('/ready', (req, res) => {
  if(ready){
    if(actors.length){
      let thisActor = actors.pop();
      res.json({
        type: 'actor',
        token: thisActor.token,
        profile: currentProfile
      });
    } else if (attendees.length){
      let thisAttendee = attendees.pop();
      res.json({
        type: 'attendee',
        token: thisAttendee.token,
        profile: currentProfile
      });
    }
    
    if(!actors.length && !attendees.length) {
      clearTimeout(resetTimeout);
      reset();
    }
  } else {
    res.sendStatus(404);
  }
});

const CONFIGS = {
  '3gfast': { 'up': 768, 'down':1600, 'rtt':75 },
  '3g': { 'up': 768, 'down':1600, 'rtt':150 },
  '3gslow': { 'up': 400, 'down':400, 'rtt':200 },
  '2g': { 'up': 32, 'down':35, 'rtt':650 },
  'cable': { 'up': 1000, 'down':5000, 'rtt':14 }
};

/* GET set the trigger. */
router.get('/trigger/:numParties/:numActors/:profile', asyncHandler(async (req, res, next) => {
  const { numParties, numActors, profile } = req.params;
  clearTimeout(resetTimeout);
  currentProfile = CONFIGS[profile];
  if(!currentProfile){
    try {
      console.log('LETS SEE')
      console.log(profile);
      console.log(decodeURIComponent(profile));
      currentProfile = JSON.parse(decodeURIComponent(profile));
    }catch(e){
      console.error('WELL IT WAS WORTH A TRY', e);
    }
  }
  currentShow = await createAndStart(numParties, numActors);
  actors = [...currentShow.actors];
  attendees = [...currentShow.attendees];
  ready = true;
  resetTimeout = setTimeout(reset, SHOW_RUNTIME);
  runShow(currentShow, (numParties > 1));
  res.setTimeout(1000, () => {
    var data = JSON.stringify({
      numActivated: i,
      currentShow
    }, null, 4);
    res.send(data);
  });
}));

module.exports = router;
