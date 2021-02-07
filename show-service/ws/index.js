const WebSocket = require('ws');
const cookie = require('cookie');
const url = require('url');
const uaParser = require('useragent');

const {
  Actor,
  Attendee,
  Guide,
  Show,
  User,
  Place,
  Party
} = require('../models');

const {
  kickParty,
  validateDecider,
  refreshSystemState,
  refreshCurrentShowState,
  updateUsersBookedShows
} = require('../util/operations');

const {
  wssAdmin,
  wssActor,
  wssAttendee,
  wssGuide,
  wssFacesIn,
  wssFacesOut
} = require('./servers');

const { validateToken } = require('../util/auth');

wssAdmin.on('connection', async function connection(ws, request, client) {

  ws.isAlive = true;
  ws.on('pong', heartbeat)

  ws.on('message', function message(msg) {
    console.log(`Received message ${msg} from admin ${client}`);
  });

  ws.on('close', async function () {
    let { userId } = ws;
    console.log(`${userId} has closed`);
    let stillOnline = false;
    wssAdmin.clients.forEach(function each(client) {
      if (client.userId === userId) {
        stillOnline = true;
      }
    });
    console.log('Still online?', stillOnline);
    if (!stillOnline) {
      await User.updateOne({ _id: userId }, { $set: { isOnline: false } });
      refreshSystemState();
    }
  });

  await User.updateOne({ _id: ws.userId }, { $set: { isOnline: true, currentBrowser: ws.browser } });
  refreshSystemState();
  refreshCurrentShowState();
});


const actorHangupTimeouts = {};
wssActor.on('connection', async function connection(ws, request, client) {

  ws.isAlive = true;
  ws.on('pong', heartbeat)
  let { userId } = ws;
  console.log(`Connection for actor ${userId}`);
  if (actorHangupTimeouts[userId]) {
    console.log(`Clearing a hangup timeout for actor ${userId}`);
    clearTimeout(actorHangupTimeouts[userId]);
    delete actorHangupTimeouts[userId];
  }

  ws.on('message', function message(msg) {
    console.log(`Received message ${msg} from actor ${client}`);
  });

  ws.on('close', function () {
    let { userId } = ws;
    console.log(`${userId} has closed`);
    let stillOnline = false;
    wssActor.clients.forEach(function each(client) {
      if (client.userId === userId) {
        stillOnline = true;
      }
    });
    if (!stillOnline && !actorHangupTimeouts[userId]) {
      console.log(`Creating a hangup timeout for actor ${userId}`);
      actorHangupTimeouts[userId] = setTimeout(async () => {
        delete actorHangupTimeouts[userId];
        console.log(`Executing a hangup timeout for actor ${userId}`);
        let actor = await Actor.findById(userId).populate({
          path: 'place',
          populate: [
            {
              path: 'currentParty',
              populate: [
                {
                  path: 'attendances',
                  populate: {
                    path: 'attendee'
                  }
                },
                {
                  path: 'guide'
                }
              ]
            },
            {
              path: 'partyQueue',
              populate: [
                {
                  path: 'attendances',
                  populate: {
                    path: 'attendee'
                  }
                },
                {
                  path: 'guide'
                }
              ]
            }
          ]
        }).lean();
        await Actor.updateOne({_id: userId}, { isOnline: false });
        let { place } = actor;
        if (place.currentParty) {
          await kickParty(place.currentParty, place);
        }
        if (place.partyQueue.length) {
          for(let i = 0; i < place.partyQueue.length; i++) {
            await kickParty(place.partyQueue[i], place);
          }
        }
        console.log(`Hangup timeout for actor ${userId} complete`);

        refreshSystemState();
        refreshCurrentShowState();
      }, 5 * 1000);
    }
  });
  let actor = await Actor.findById(ws.userId).lean();

  if (!actor.isOnline) {
    await Promise.all([
      Actor.updateOne({ _id: ws.userId}, {isOnline: true, isAvailable: false, currentBrowser: ws.browser}),
      Place.updateOne({ _id: actor.place }, { isAvailable: false, currentFilter: null })
    ]);
  }

  refreshSystemState();
  refreshCurrentShowState();
});

const attendeeHangupTimeouts = {};
wssAttendee.on('connection', async function connection(ws, request, client) {
  let { userId } = ws;
  let user = await Attendee.findById(userId);
  if(!user || user.isBlocked){
    return ws.close();
  }
  ws.isAlive = true;
  ws.on('pong', heartbeat)

  console.log(`Connection for attendee ${userId}`);
  if (attendeeHangupTimeouts[userId]) {
    console.log(`Clearing a hangup timeout for attendee ${userId}`);
    clearTimeout(attendeeHangupTimeouts[userId]);
    delete attendeeHangupTimeouts[userId];
  }

  ws.on('message', function message(msg) {
    console.log(`Received message ${msg} from attendee ${client}`);
  });

  ws.on('close', async function () {
    let { userId } = ws;
    console.log(`${userId} has closed`);
    let stillOnline = false;
    wssAttendee.clients.forEach(function each(client) {
      if (client.userId === userId) {
        stillOnline = true;
      }
    });
    if (!stillOnline && !attendeeHangupTimeouts[userId]) {
      console.log(`Creating a hangup timeout for attendee ${userId}`);
      attendeeHangupTimeouts[userId] = setTimeout(async () => {
        delete attendeeHangupTimeouts[userId];
        console.log(`Executing a hangup timeout for attendee ${userId}`);
        await User.updateOne({ _id: userId }, { $set: { isOnline: false } });

        let currentShow = await Show.getCurrentShowState();
        if(currentShow && currentShow.currentPhase.kind === 'FREEPLAY'){
          let matchingParties = currentShow.parties.filter(party => party.attendances.reduce((acc,attendance) => acc || attendance.attendee._id === userId, false));
          if(matchingParties[0]){
            await validateDecider(matchingParties[0]);
          }
        }

        refreshSystemState();
        refreshCurrentShowState();
      }, 2 * 1000);
    }
  });
  await User.updateOne({ _id: userId }, { $set: { isOnline: true, currentBrowser: ws.browser } });
  let currentShow = await Show.getCurrentShowState();
  if(currentShow && currentShow.currentPhase.kind === 'FREEPLAY'){
    let matchingParties = currentShow.parties.filter(party => party.attendances.reduce((acc,attendance) => acc || attendance.attendee._id === userId, false));
    if(matchingParties[0]){
      await validateDecider(matchingParties[0]);
    }
  }

  refreshSystemState();
  refreshCurrentShowState();
  updateUsersBookedShows(userId);
});


const guideHangupTimeouts = {};
wssGuide.on('connection', async function connection(ws, request, client) {
  let { userId } = ws;
  let user = await Guide.findById(userId);
  if(!user){
    return ws.close();
  }
  ws.isAlive = true;
  ws.on('pong', heartbeat)

  console.log(`Connection for guide ${userId}`);
  if (guideHangupTimeouts[userId]) {
    console.log(`Clearing a hangup timeout for guide ${userId}`);
    clearTimeout(guideHangupTimeouts[userId]);
    delete guideHangupTimeouts[userId];
  }

  ws.on('message', function message(msg) {
    console.log(`Received message ${msg} from guide ${client}`);
  });

  ws.on('close', async function () {
    let { userId } = ws;
    console.log(`${userId} has closed`);
    let stillOnline = false;
    wssGuide.clients.forEach(function each(client) {
      if (client.userId === userId) {
        stillOnline = true;
      }
    });
    if (!stillOnline && !guideHangupTimeouts[userId]) {
      console.log(`Creating a hangup timeout for guide ${userId}`);
      guideHangupTimeouts[userId] = setTimeout(async () => {
        delete guideHangupTimeouts[userId];
        console.log(`Executing a hangup timeout for guide ${userId}`);
        await User.updateOne({ _id: userId }, { $set: { isOnline: false } });

        let currentShow = await Show.getCurrentShowState();
        if(currentShow && currentShow.currentPhase.kind === 'FREEPLAY') {
          let matchingParties = currentShow.parties.filter(party => party.guide._id === userId);
          if(matchingParties[0]){
            await validateDecider(matchingParties[0]);
          }
        }

        refreshSystemState();
        refreshCurrentShowState();
      }, 2 * 1000);
    }
  });
  await User.updateOne({ _id: userId }, { $set: { isOnline: true, currentBrowser: ws.browser } });
  let currentShow = await Show.getCurrentShowState();
  if(currentShow && currentShow.currentPhase.kind === 'FREEPLAY') {
    let matchingParties = currentShow.parties.filter(party => party.guide._id === userId);
    if(matchingParties[0]){
      await validateDecider(matchingParties[0]);
    }
  }

  refreshSystemState();
  refreshCurrentShowState();
  updateUsersBookedShows(userId);
});

wssFacesIn.on('connection', async function connection(ws, request, client) {
  ws.isAlive = true;
  ws.on('pong', heartbeat)

  ws.on('message', function message(msg) {
    // console.log(`Received message ${msg} from faces-in `);

    wssFacesOut.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });
});

wssFacesOut.on('connection', async function connection(ws, request, client) {
  ws.isAlive = true;
  ws.on('pong', heartbeat)

  ws.on('message', function message(msg) {
    console.log(`Received message ${msg} from faces-out`);
  });
});

function heartbeat() {
  this.isAlive = true;
}

function noop() { }

function ping(ws) {
  if (ws.isAlive === false) return ws.terminate();

  ws.isAlive = false;
  ws.ping(noop);
}

setInterval(function () {
  wssAdmin.clients.forEach(ping);
  wssActor.clients.forEach(ping);
  wssAttendee.clients.forEach(ping);
  // wssFacesIn.clients.forEach(ping);
  // wssFacesOut.clients.forEach(ping);
}, 30 * 1000);

module.exports = function startWebsockets(server) {
  server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = url.parse(request.url).pathname;
    console.log('UPGRADE', uaParser.parse(request.headers['user-agent']).toString());
    switch (pathname) {
      case '/faces-input':
        wssFacesIn.handleUpgrade(request, socket, head, function done(ws) {
          ws.browser = uaParser.parse(request.headers['user-agent']).toString();
          wssFacesIn.emit('connection', ws, request);
        });
        break;
      case '/faces-output':
        wssFacesOut.handleUpgrade(request, socket, head, function done(ws) {
          ws.browser = uaParser.parse(request.headers['user-agent']).toString();
          wssFacesOut.emit('connection', ws, request);
        });
        break;
      case '/':
        try {
          const cookies = cookie.parse(request.headers.cookie);
          let token = cookies['promenade-auth-token'];
          let { userId, kind } = validateToken(token);

          switch (kind) {
            case 'Admin':
              wssAdmin.handleUpgrade(request, socket, head, function done(ws) {
                ws.browser = uaParser.parse(request.headers['user-agent']).toString();
                ws.userId = userId;
                ws.kind = kind;
                wssAdmin.emit('connection', ws, request);
              });
              break;
            case 'Actor':
              wssActor.handleUpgrade(request, socket, head, function done(ws) {
                ws.browser = uaParser.parse(request.headers['user-agent']).toString();
                ws.userId = userId;
                ws.kind = kind;
                wssActor.emit('connection', ws, request);
              });
              break;
            case 'Attendee':
              wssAttendee.handleUpgrade(request, socket, head, function done(ws) {
                ws.browser = uaParser.parse(request.headers['user-agent']).toString();
                ws.userId = userId;
                ws.kind = kind;
                wssAttendee.emit('connection', ws, request);
              });
              break;
            case 'Guide':
              wssGuide.handleUpgrade(request, socket, head, function done(ws) {
                ws.browser = uaParser.parse(request.headers['user-agent']).toString();
                ws.userId = userId;
                ws.kind = kind;
                wssGuide.emit('connection', ws, request);
              });
              break;
            default:
              socket.destroy();
          }
        } catch (e) {
          console.error('WEBSOCKET UPGRADE ERROR', e);
          socket.destroy();
        }
        break;
    }
  });
}