/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  RECEIVE_SYSTEM_STATE,
  RECEIVE_CURRENT_SHOW_STATE,
  REPORT_LOGIN,
  REPORT_ERROR,
  REPORT_SLOWLINK,
  REFRESH_SLOWLINK_DATA,
  FORCE_REFRESH,
  TOGGLE_NOTIFICATIONS
} from '../actions/const';

const initialState = {
  isAuthenticating: false,
  triedAuthentication: false,
  user: null,
  admins: [],
  actors: [],
  attendees: [],
  guides: [],
  shows: [],
  currentShow: null,
  logins: [],
  errors: [],
  slowlinkEvents: [],
  slowlinkData: [],
  scenes: [],
  pullTime: null,
  showPullTime: null,
  adminSockets: null,
  actorSockets: null,
  attendeeSockets: null,
  janusCoefficient: 0,
  wantsNotifications: (localStorage.getItem('wantsNotifications') === 'true'),
};

import SLOWLINK_TYPES from '../enum/slowlinkTypes';

function calcDervivedProperties(state, nextState) {
  let { 
    currentShow,
    actors,
    guides
  } = nextState;
  let now = Date.now();

  let slowlinkData = [
    ...actors.filter(user => user.isOnline).map(user => ({ events:[], user })),
    ...guides.filter(user => user.isOnline).map(user => ({ events:[], user }))
  ];
  if (currentShow) {
    slowlinkData = [
      ...slowlinkData,
      ...currentShow.parties.flatMap(party => party.attendees
        .filter(user => user.isOnline)
        .map(user => {
          console.log('USER', user);
          return { events:[], user }
        })
      )
    ];
  }

  nextState.slowlinkEvents = nextState.slowlinkEvents.filter(event => event.timestamp > (now - 10 * 1000));
  nextState.slowlinkEvents.map(event => {
    for(let i=0; i < slowlinkData.length; i++) {
      let slowlinkUser = slowlinkData[i];
      if(slowlinkUser.user._id === event.userId){
        slowlinkUser.events.push(event);
        break;
      }
    }
  });

  slowlinkData.map(slowlinkUser => {
    slowlinkUser.totals = {};
    Object.keys(SLOWLINK_TYPES).map(type => {
      slowlinkUser.totals[type] = 0;
    })
    slowlinkUser.events.map(event => {    
      slowlinkUser.totals[event.type] += event.lost;  
    });
  });

  nextState.slowlinkData = slowlinkData;

  

  // Handle any notifications
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && nextState.wantsNotifications) {
    let notificationStartTime = Date.now();
    let oldUsers = {};
    state.admins.map(user => {
      oldUsers[user._id] = user;
    });
    state.actors.map(user => {
      oldUsers[user._id] = user;
    });
    state.attendees.map(user => {
      oldUsers[user._id] = user;
    });
    state.guides.map(user => {
      oldUsers[user._id] = user;
    });
    let newUsers = {};
    nextState.admins.map(user => {
      newUsers[user._id] = user;
    });
    nextState.actors.map(user => {
      newUsers[user._id] = user;
    });
    nextState.attendees.map(user => {
      newUsers[user._id] = user;
    });
    nextState.guides.map(user => {
      newUsers[user._id] = user;
    });

    let isEnding = nextState.currentShow && (nextState.currentShow.state === 'ENDING' || nextState.currentShow.state === 'HAS_ENDED');

    Object.keys(newUsers).map(userId => {
      let oldUser = oldUsers[userId];
      let newUser = newUsers[userId];
      if(oldUser) {
        if((!isEnding || newUser.kind !== 'Attendee') && oldUser.isOnline && !newUser.isOnline) {
          new Notification(`${newUser.username} logged out`, {
            body: `(${newUser.kind}) ${newUser.username} logged out`,
            badge: `/favicons/${newUser.kind.toLowerCase()}-touch-icon-iphone-retina.png`,
            icon: `/favicons/${newUser.kind.toLowerCase()}-touch-icon-iphone-retina.png`,
            silent: true
          });
        } else if(!oldUser.isOnline && newUser.isOnline) {
          new Notification(`${newUser.username} logged in!`, {
            body: `(${newUser.kind}) ${newUser.username} logged in`,
            badge: `/favicons/${newUser.kind.toLowerCase()}-touch-icon-iphone-retina.png`,
            icon: `/favicons/${newUser.kind.toLowerCase()}-touch-icon-iphone-retina.png`,
            silent: true
          });
        }

        if(newUser.kind === 'Actor' && oldUser.isOnline) {
          let oldPlace = oldUser.place;
          let newPlace = newUser.place;
          if(!oldPlace.currentParty && newPlace.currentParty) {
            let { currentParty } = newPlace;
            new Notification(`${newUser.username} accepted ${currentParty.name}!`, {
              body: `${currentParty.name} is visiting ${newPlace.characterName} @ ${newPlace.placeName} (${newUser.username})`,
              badge: `/favicons/${newUser.kind.toLowerCase()}-touch-icon-iphone-retina.png`,
              icon: `/favicons/${newUser.kind.toLowerCase()}-touch-icon-iphone-retina.png`,
              silent: true
            });
          } else if(oldPlace.currentParty && !newPlace.currentParty) {
            let { currentParty } = oldPlace;
            new Notification(`${newUser.username} kicked ${currentParty.name}`, {
              body: `${currentParty.name} has left ${newPlace.characterName} @ ${newPlace.placeName} (${newUser.username})`,
              badge: `/favicons/${newUser.kind.toLowerCase()}-touch-icon-iphone-retina.png`,
              icon: `/favicons/${newUser.kind.toLowerCase()}-touch-icon-iphone-retina.png`,
              silent: true
            });
          } else if(oldPlace.isAvailable && !newPlace.isAvailable) {
            new Notification(`${newUser.username} is unavailable`, {
              body: `${newPlace.characterName} @ ${newPlace.placeName} (${newUser.username}) marked themselves unavailable`,
              badge: `/favicons/${newUser.kind.toLowerCase()}-touch-icon-iphone-retina.png`,
              icon: `/favicons/${newUser.kind.toLowerCase()}-touch-icon-iphone-retina.png`,
              silent: true
            });
          } else if(!oldPlace.isAvailable && newPlace.isAvailable) {
            new Notification(`${newUser.username} is now available!`, {
              body: `${newPlace.characterName} @ ${newPlace.placeName} (${newUser.username}) marked themselves available`,
              badge: `/favicons/${newUser.kind.toLowerCase()}-touch-icon-iphone-retina.png`,
              icon: `/favicons/${newUser.kind.toLowerCase()}-touch-icon-iphone-retina.png`,
              silent: true
            });
          }
        }
      }
    });
    console.log(`NOTIFICATION PARSE TOOK: ${(Date.now() - notificationStartTime) / 1000} sec`);

  }
}

function reducer(state = initialState, action) {
  /* Keep the reducer clean - do not mutate the original state. */
  const nextState = JSON.parse(JSON.stringify(state));
  console.log(action);

  switch (action.type) {
    case LOGIN: {
      nextState.isAuthenticating = true;
      return nextState;
    }

    case LOGIN_SUCCESS: {
      nextState.isAuthenticating = false;
      nextState.triedAuthentication = true;
      nextState.user = action.user;
      return nextState;
    }

    case LOGIN_FAILURE: {
      nextState.isAuthenticating = false;
      nextState.triedAuthentication = true;
      nextState.user = null;
      return nextState;
    }

    case RECEIVE_SYSTEM_STATE: {
      let {
        shows,
        actors,
        admins,
        attendees,
        guides,
        scenes,
        pullTime,
        adminSockets,
        actorSockets,
        attendeeSockets,
        guideSockets,
        janusCoefficient
      } = action.body;
      nextState.shows = shows;
      nextState.actors = actors;
      nextState.admins = admins;
      nextState.attendees = attendees;
      nextState.guides = guides;
      nextState.scenes = scenes;
      nextState.pullTime = pullTime;
      nextState.adminSockets = adminSockets;
      nextState.actorSockets = actorSockets;
      nextState.attendeeSockets = attendeeSockets;
      nextState.guideSockets = guideSockets;
      nextState.janusCoefficient = janusCoefficient;
      calcDervivedProperties(state, nextState);
      return nextState;
    }

    case RECEIVE_CURRENT_SHOW_STATE: {
      nextState.showPullTime = action.body.pullTime;
      nextState.currentShow = action.body.currentShow;
      calcDervivedProperties(state, nextState);
      return nextState;
    }

    case REPORT_LOGIN: {
      nextState.logins = [action.body, ...state.logins];
      return nextState;
    }

    case REPORT_ERROR: {
      nextState.errors = [action.body, ...state.errors];
      return nextState;
    }

    case REPORT_SLOWLINK: {
      nextState.slowlinkEvents = [action.body, ...state.slowlinkEvents];
      calcDervivedProperties(state, nextState);
      return nextState;
    }

    case REFRESH_SLOWLINK_DATA: {
      calcDervivedProperties(state, nextState);
      return nextState;
    }

    case FORCE_REFRESH: {
      location.reload();
      return nextState;
    }

    case TOGGLE_NOTIFICATIONS: {
      nextState.wantsNotifications = action.wantsNotifications;
      localStorage.setItem('wantsNotifications', action.wantsNotifications);
      if(typeof Notification !== 'undefined' && action.wantsNotifications && Notification.permission === 'default'){
        Notification.requestPermission();
      }
      return nextState;
    }

    default: {
      /* Return original state if no actions were consumed. */
      return state;
    }
  }
}

export default reducer;
