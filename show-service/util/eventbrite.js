const fetch = require('node-fetch');
const { Show, User, Attendance } = require('../models');
const {
  refreshSystemState,
  updateUsersBookedShows
} = require('../util/operations');
const {
  delay
} = require('../util/misc');
const {
  EVENTBRITE_TOKEN,
  EVENTBRITE_SERIESID
} = require('../secrets/credentials.json');


async function getEventBriteShows() {
  const response = await fetch(`https://www.eventbriteapi.com/v3/series/${EVENTBRITE_SERIESID}/events?token=${EVENTBRITE_TOKEN}`);
  return await response.json();
}

async function getEventBriteAttendees(showId) {
  const response = await fetch(`https://www.eventbriteapi.com/v3/events/${showId}/attendees/?token=${EVENTBRITE_TOKEN}`);
  let result = await response.json();
  let { attendees } = result;
  console.log('FETCH!', `https://www.eventbriteapi.com/v3/events/${showId}/attendees/?token=${EVENTBRITE_TOKEN}`, JSON.stringify(result, null, 4));
  return attendees
    .filter(attendee => attendee.barcodes[0].status !== 'refunded')
    .map(attendee => ({
      email: attendee.profile.email,
      username: attendee.answers.reduce((acc, answer) => acc || (answer.question.indexOf('Adventurer') !== -1 && answer.answer), null)
    }));
}

async function addAttendee(email, showId, username) {
  const response = await Attendance.bookTicket(email, showId, username);
  const user = await User.findById(response.attendee).lean();
  updateUsersBookedShows(user._id);
  return response;
}

async function removeAttendee(email, showId) {
  const response = await Attendance.deleteTicket(email, showId);
  updateUsersBookedShows(response._id);
  return response;
}

let isCurrentlySyncing = false;
async function syncWithEventbrite() {
  while (isCurrentlySyncing) {
    await delay(100);
  }
  isCurrentlySyncing = true;
  try {
    const startTime = Date.now(); 
    //Get Shows EventBrite
    let [
      {
        pagination,
        events: eventBriteEvents
      },
      shatteredEvents
      ] = await Promise.all([
        getEventBriteShows(),
        Show.getTotalState()
      ]);

    // for (let i = 0; i < eventBriteEvents.length; i++){
    //   let eventShow = eventBriteEvents[i];
    await Promise.all(eventBriteEvents.map(async eventShow => {
      let eventBriteShowDate = eventShow.start.utc;
      let shatteredMatch = shatteredEvents.find(o => (parseInt(o.eventBriteId) === parseInt(eventShow.id)));

      let eventBriteAttendees = await getEventBriteAttendees(eventShow.id);

      if (!shatteredMatch) {
        shatteredMatch = await Show.scheduleShow(eventBriteShowDate, 6, true, eventShow.id);
        
        // await Promise.all(eventBriteAttendees.map(async (attendee) => {
        //   await addAttendee(attendee.email, shatteredMatch._id, attendee.username);
        // }));
        for(let j=0; j < eventBriteAttendees.length; j++){
          let attendee = eventBriteAttendees[j];
          await addAttendee(attendee.email, shatteredMatch._id, attendee.username);
        }
      } else {
        let currentAttendees = []; //shatteredMatch.parties.map(a => a.attendees.map(x => x.email));
        for (let j = 0; j < shatteredMatch.parties.length; j++) {
          if (shatteredMatch.parties[j] && shatteredMatch.parties[j].attendees){
            for (let l = 0; l < shatteredMatch.parties[j].attendees.length; l++) {
              currentAttendees.push(shatteredMatch.parties[j].attendees[l].email);
            }
          }
        }

        let attendeesToRemove = currentAttendees.filter(attendee => !eventBriteAttendees.filter(x => x.email == attendee));

        // await Promise.all(attendeesToRemove.map(attendee => removeAttendee(attendee.email, shatteredMatch._id)));
        for(let j=0; j < attendeesToRemove.length; j++){
          let attendee = attendeesToRemove[j];
          await removeAttendee(attendee.email, shatteredMatch._id);
        }

        let attendeesToAdd = eventBriteAttendees.filter(attendee => !currentAttendees.includes(attendee.email));

        // await Promise.all(attendeesToAdd.map(attendee => addAttendee(attendee.email, shatteredMatch._id, attendee.username)));
        for(let j=0; j < attendeesToAdd.length; j++){
          let attendee = attendeesToAdd[j];
          await addAttendee(attendee.email, shatteredMatch._id, attendee.username);
        }
      }
    }));
    
    const timeElapsed = (Date.now() - startTime)/1000;
    console.log(`EVENTBRITE SYNCED! ${timeElapsed} seconds`);
  } catch(e) {
    console.error('EVENTBRITE SYNC ERROR', e);
  }
  isCurrentlySyncing = false;
}

module.exports = {
  getEventBriteShows,
  getEventBriteAttendees,
  addAttendee,
  removeAttendee,
  syncWithEventbrite
}