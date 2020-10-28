const _ = require('lodash');
const fetch = require('node-fetch');
const { SHOW_RUNTIME } = require('../constants');
const { ADMIN_TOKEN, SERVICE_HOST } = require('../secrets/load-test-credentials.json');

async function createShow(date=Date.now(), numParties=6) {
  let response = await fetch(`${SERVICE_HOST}/shows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `promenade-auth-token=${ADMIN_TOKEN};`
    },
    body: JSON.stringify({date, numParties}),
    credentials: 'include'
  });

  return await response.json();
}

async function createActor(email, username, characterName, placeName, flavorText, audioPath, audioVolume, assetKey) {
  let response = await fetch(`${SERVICE_HOST}/users/actor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `promenade-auth-token=${ADMIN_TOKEN};`
    },
    body: JSON.stringify({ email, username, characterName, placeName, flavorText, audioPath, audioVolume, assetKey }),
    credentials: 'include'
  });

  return await response.json();
}

async function createAttendee(showId, email) {
  let response = await fetch(`${SERVICE_HOST}/users/bookTicket`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `promenade-auth-token=${ADMIN_TOKEN};`
    },
    body: JSON.stringify({showId, email, sendEmail: false }),
    credentials: 'include'
  });

  return await response.json();
}

async function startShow(showId) {
  let response = await fetch(`${SERVICE_HOST}/shows/run`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `promenade-auth-token=${ADMIN_TOKEN};`
    },
    body: JSON.stringify({showId, isRunning: true }),
    credentials: 'include'
  });

  return await response.json();
}

async function stopShow(showId) {
  let response = await fetch(`${SERVICE_HOST}/shows/run`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `promenade-auth-token=${ADMIN_TOKEN};`
    },
    body: JSON.stringify({showId, isRunning: false }),
    credentials: 'include'
  });

  return await response.json();
}

async function changeShowStatus(showId, state) {
  let response = await fetch(`${SERVICE_HOST}/shows/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `promenade-auth-token=${ADMIN_TOKEN};`
    },
    body: JSON.stringify({showId, state }),
    credentials: 'include'
  });

  return await response.json();
}

async function getCurrentShow() {
  let response = await fetch(`${SERVICE_HOST}/shows/current`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `promenade-auth-token=${ADMIN_TOKEN};`
    },
    credentials: 'include'
  });

  return await response.json();
}

async function getShows() {
  let response = await fetch(`${SERVICE_HOST}/shows`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `promenade-auth-token=${ADMIN_TOKEN};`
    },
    credentials: 'include'
  });

  return await response.json();
}

async function getFullState() {
  let response = await fetch(`${SERVICE_HOST}/shows/full`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `promenade-auth-token=${ADMIN_TOKEN};`
    },
    credentials: 'include'
  });

  return await response.json();
}

async function queueParty(partyId, placeId, token) {
  let response = await fetch(`${SERVICE_HOST}/navigation/queue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `promenade-auth-token=${token};`
    },
    body: JSON.stringify({ placeId, partyId }),
    credentials: 'include'
  });

  return;
}

async function acceptParty(partyId, placeId, token) {
  let response = await fetch(`${SERVICE_HOST}/navigation/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `promenade-auth-token=${token};`
    },
    body: JSON.stringify({ placeId, partyId }),
    credentials: 'include'
  });
  return;
}

async function kickParty(partyId, placeId, token) {
  let response = await fetch(`${SERVICE_HOST}/navigation/kick`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `promenade-auth-token=${token};`
    },
    body: JSON.stringify({ placeId, partyId }),
    credentials: 'include'
  });

  return;
}

async function sendMessage(partyId, content, token) {
  console.log('SENDING MESSAGE', `${SERVICE_HOST}/parties/${partyId}/sendMessage`, content, token);
  let response = await fetch(`${SERVICE_HOST}/parties/${partyId}/sendMessage`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `promenade-auth-token=${token};`
    },
    body: JSON.stringify({ content }),
    credentials: 'include'
  });
  console.log('DID IT WORK', response.ok);
  return;
}

async function delay(amount){
  return await new Promise(resolve => setTimeout(resolve, amount));
}

async function createAndStart(numParties, numActors) {
  try {

    let startTime = Date.now();
    console.log('LETS GO!');

    let [newShow, actors] = await Promise.all([
      createShow(Date.now(), numParties),
      Promise.all(_.range(numActors).map(() => createActor(`${Math.round(Math.random()*1e9)}@loadtest.com`, `actor${Math.round(Math.random()*1e9)}`, `character${Math.round(Math.random()*1e9)}`, `place${Math.round(Math.random()*1e9)}`, `Somewhere`, ``, 0, `CosmicRapids`)))
    ]);
    console.log('SHOW', newShow);
    console.log('ACTORS', JSON.stringify(actors, null, 4));

    let attendees = [];
    for (let i = 0; i < 5*numParties; i++){
      attendees.push(await createAttendee(newShow._id, `${Math.round(Math.random()*1e9)}@loadtest.com`));
    }
    console.log('ATTENDEES', JSON.stringify(attendees, null, 4));

    await startShow(newShow._id)
    let fullShow = await getCurrentShow();
    console.log('STARTED', JSON.stringify(fullShow, null, 4));
    let finishTime = Date.now();
    console.log(`Setup completed in ${(finishTime - startTime)/1000}sec`);

    return {
      fullShow,
      actors,
      attendees
    }
  } catch(e){
    console.error('OHNO', e);
    throw e;
  }
}

async function sendEveryone(showData) {
  console.log('SENDING EVERYONE');
  showData.fullShow = await getCurrentShow();
  const {
    fullShow,
    actors,
    attendees
  } = showData;

  await Promise.all(fullShow.parties.map(async (party, i) => {
    let { token: attendeeToken } = attendees.filter(attendee => attendee.attendance.party === party._id)[0];
    let { _id: partyId } = party;
    let { place: { _id: placeId }, token: actorToken } = actors[i];
    await queueParty(partyId, placeId, attendeeToken);
    await delay(Math.random() * 10 * 1000);
    await acceptParty(partyId, placeId, actorToken);
    return;
  }));
  console.log('EVERYONE SENT');
}

async function sendMessages(showData) {
  try {
    console.log('SENDING MESSAGES');
    // showData.fullShow = await getCurrentShow();
    const {
      fullShow,
      actors,
      attendees
    } = showData;
  
    await Promise.all(fullShow.parties.map(async (party, i) => {
      let { token: attendeeToken } = attendees.filter(attendee => attendee.attendance.party === party._id)[0];
      let { _id: partyId } = party;
      await sendMessage(partyId, `HEYO! ${Math.round(Math.random()*1e9)}`, attendeeToken);
      return;
    }));
    console.log('MESSAGES SENT');
  } catch(e) {
    console.error('UHOH', e);
  }
}

async function nextIteration(showData) {
  console.log('NEXT ITERATION');
  showData.fullShow = await getCurrentShow();
  const {
    fullShow,
    actors,
    attendees
  } = showData;

  freePlaces = _.shuffle(fullShow.places).filter(place => !place.currentParty);
  freeActors = freePlaces.map(place => actors.filter(actor => actor.place === place._id)[0]);

  await Promise.all(fullShow.parties.map(async (party, i) => {
    let { token: attendeeToken } = attendees.filter(attendee => attendee.attendance.party === party._id)[0];
    let { partyId, currentPlace } = party;
    
    if(currentPlace) {
      let { place: { _id: oldPlaceId }, token: oldActorToken } = actors.filter(actor => actor.place._id === currentPlace)[0]
      await kickParty(partyId, oldPlaceId, oldActorToken);
      await delay(Math.random() * 10 * 1000);
    }
    
    if(freeActors[i]){
      let { place: { _id: newPlaceId }, token: newActorToken } = freeActors[i];
      await queueParty(partyId, newPlaceId, attendeeToken);
      await delay(Math.random() * 10 * 1000);
      await acceptParty(partyId, newPlaceId, newActorToken);
    }
    return;
  }));
  console.log('ITERATION COMPLETE');
}

async function runShow(showData, automate=false) {
  try {
    const startTime = Date.now();
    const {
      fullShow,
      actors,
      attendees
    } = showData;
    
    await delay(10 * 1000);
    await changeShowStatus(fullShow._id, 'FREEPLAY');
    await delay(3 * 1000);
    // if(automate){
      await sendEveryone(showData);
    // }
  
    while((Date.now() - startTime) < SHOW_RUNTIME) {
      await delay(Math.random() * 1000);
      // await sendMessages(showData);
      if(automate) {

        // await nextIteration(showData);
      }
    }
    await delay(Math.random() * 30 * 1000);
    console.log('ENDING SHOW');
    await changeShowStatus(fullShow._id, 'HAS_ENDED');
    await delay(Math.random() * 10 * 1000);
    console.log('STOPPING SHOW');
    await stopShow(fullShow._id);
  } catch(e){
    console.error('OHNO', e);
    throw e;
  }
}

module.exports = {
  createAndStart,
  runShow,
  getCurrentShow,
  delay
};