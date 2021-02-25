/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  ATTACH_LOCAL_FEED,
  ATTACH_REMOTE_FEED,
  DETACH_REMOTE_FEED,
  RECEIVE_REMOTE_FEED,
  LEAVE_VIDEO_ROOM,
  RECEIVE_AUDIO_BRIDGE_FEED,
  LEAVE_AUDIO_BRIDGE,
  SET_LOCAL_MUTES,
  SET_LOCAL_STREAM,
  SEND_CHAT_MESSAGE,
  APPEND_CHAT_MESSAGE,
  RECEIVE_CURRENT_SHOW_STATE,
  SET_FILTER_NAME,
  GET_LOCAL_FEED_SUCCESS,
  GET_LOCAL_FEED_FAILURE,
  GET_LOCAL_FEED,
  GET_INPUT_DEVICES,
  GET_INPUT_DEVICES_SUCCESS,
  GET_INPUT_DEVICES_FAILURE,
  TOGGLE_NERDINESS,
  TOGGLE_NOTIFICATIONS,
  PREVIEW_PARTY
} from '../actions/const';

import { format } from 'date-fns';

const initialState = {
  askingMediaConsent: false,
  hasAskedMediaConsent: false,
  isAuthenticating: false,
  triedAuthentication: false,
  isSwitchingInputs: false,
  audioInputs: [],
  videoInputs: [],
  chosenVideoInput: null,
  chosenAudioInput: null,
  user: null,
  currentShow: null,
  places: [],
  myCurrentPlace: null,
  previewedPartyId: null,
  previewedParty: null,
  currentParty: null,
  feeds: [],
  localFeed: null,
  isGettingInputFeed: false,
  gotInputFeed: false,
  localInputStream: null,
  localInputVideo: null,
  localOutputStream: null,
  audioBridgeFeed: null,
  audioMute: false,
  videoMute: false,
  chatMessages: [],
  activeFilter: 'none',
  isNerdy: true,
  wantsNotifications: (localStorage.getItem('wantsNotifications') === 'true')
};

function calcDervivedProperties(state, nextState) {
  let { user, places } = nextState;

  if (places) {
    let matchingPlaces = places.filter(place => place._id === user.place);
    nextState.myCurrentPlace = matchingPlaces.length ? matchingPlaces[0] : null;
  } else {
    nextState.myCurrentPlace = null;
  }

  if (nextState.myCurrentPlace && nextState.myCurrentPlace.currentParty) {
    nextState.currentParty = nextState.myCurrentPlace.currentParty;
  } else {
    nextState.currentParty = null;
  }

  if (Notification.permission === 'granted' && nextState.wantsNotifications) {
    if (
      (!state.myCurrentPlace && nextState.myCurrentPlace && nextState.myCurrentPlace.partyQueue.length) || 
      (state.myCurrentPlace && nextState.myCurrentPlace && nextState.myCurrentPlace.partyQueue.length > state.myCurrentPlace.partyQueue.length)
    ) {
      let newParty = nextState.myCurrentPlace.partyQueue.slice(-1)[0];
      new Notification(`Incoming party`, {
        body: `${newParty.name} has joined your party queue`,
        badge: 'static/touch-icon-iphone-retina.png',
        icon: 'static/touch-icon-iphone-retina.png',
        silent: !nextState.myCurrentPlace.currentParty
      });
    }

    if(state.currentShow && nextState.currentShow && state.currentShow.state !== 'FREEPLAY' && nextState.currentShow.state === 'FREEPLAY') {
      let dateString = format(new Date(nextState.currentShow.date), 'h:mm a');
      new Notification(`Get ready!`, {
        body: `The ${dateString} show has entered Freeplay Mode`,
        badge: 'static/touch-icon-iphone-retina.png',
        icon: 'static/touch-icon-iphone-retina.png',
        silent: !(nextState.myCurrentPlace && nextState.myCurrentPlace.currentParty)
      });
    }

    if(state.currentShow && nextState.currentShow && state.currentShow.state === 'FREEPLAY' && nextState.currentShow.state !== 'FREEPLAY') {
      let dateString = format(new Date(nextState.currentShow.date), 'h:mm a');
      new Notification(`Aaaaand Break!`, {
        body: `The ${dateString} show has ended Freeplay Mode`,
        badge: 'static/touch-icon-iphone-retina.png',
        icon: 'static/touch-icon-iphone-retina.png',
        silent: !(nextState.myCurrentPlace && nextState.myCurrentPlace.currentParty)
      });
    }
  }

  if (nextState.currentParty) {
    nextState.previewedPartyId = null;
    nextState.chatMessages = nextState.currentParty.chat;
    nextState.currentParty.attendees = nextState.currentParty.attendees.map(attendee => {
      let matchingFeeds = nextState.feeds.filter(feed => feed.remoteFeed.rfdisplay.slice(9) === attendee._id);
      if(matchingFeeds && matchingFeeds.length) {
        attendee = Object.assign({}, attendee);
        attendee.feed = matchingFeeds[0];
      }
      return attendee;
    });
  } else {
    nextState.chatMessages = [];
  }

  if (nextState.currentShow && nextState.previewedPartyId) {
    let matchingParties = nextState.currentShow.parties.filter(party => party._id === nextState.previewedPartyId);
    nextState.previewedParty = matchingParties.length ? matchingParties[0] : null;
  } else {
    nextState.previewedParty = null;
  }
}

function reducer(state = initialState, action) {
  const nextState = Object.assign({}, state);
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
    
    case SET_FILTER_NAME: {
      nextState.activeFilter = action.filter;
      return nextState;
    }
    
    case ATTACH_LOCAL_FEED: {
      nextState.localFeed = action.feed;
      return nextState;
    }
    
    case GET_LOCAL_FEED: {
      nextState.isGettingInputFeed = true;
      nextState.chosenAudioInput = action.audioDeviceId;
      localStorage.setItem('chosenAudioInput', action.audioDeviceId);
      nextState.chosenVideoInput = action.videoDeviceId;
      localStorage.setItem('chosenVideoInput', action.videoDeviceId);
      return nextState;
    }
    
    case GET_LOCAL_FEED_FAILURE: {
      nextState.isGettingInputFeed = false;
      nextState.gotInputFeed = false;
      nextState.localInputStream = null;
      return nextState;
    }
    
    case GET_LOCAL_FEED_SUCCESS: {
      nextState.isGettingInputFeed = false;
      nextState.gotInputFeed = true;
      nextState.localInputStream = action.stream;
      nextState.localInputVideo = action.videoEl;
      if(nextState.mixerContext){
        nextState.mixerContext.close()
      }
      nextState.mixerContext = action.mixerContext;
      if(nextState.audioSource){
        nextState.audioSource.disconnect();
      }
      nextState.audioSource = action.audioSource;
      if(nextState.mixerOutput){
        nextState.mixerOutput.disconnect();
      }
      nextState.mixerOutput = action.mixerOutput;
      nextState.mixerOutputStream = action.mixerOutputStream;
      nextState.localOutputStream = null;
      return nextState;
    }
    
    case SET_LOCAL_STREAM: {
      nextState.localOutputStream = action.stream;
      return nextState;
    }
    
    case GET_INPUT_DEVICES: {
      nextState.askingMediaConsent = true;
      return nextState;
    }
    
    case GET_INPUT_DEVICES_SUCCESS: {
      nextState.videoInputs = action.devices.filter(device => device.kind === 'videoinput');
      nextState.audioInputs = action.devices.filter(device => device.kind === 'audioinput');
      nextState.askingMediaConsent = false;
      nextState.hasAskedMediaConsent = true;
      return nextState;
    }
    
    case GET_INPUT_DEVICES_FAILURE: {
      nextState.askingMediaConsent = false;
      nextState.hasAskedMediaConsent = true;
      return nextState;
    }
    
    case ATTACH_REMOTE_FEED: {
      nextState.feeds = [...nextState.feeds, action.feed];
      calcDervivedProperties(state, nextState);
      return nextState;
    }
    
    case DETACH_REMOTE_FEED: {
      nextState.feeds = nextState.feeds.filter(feed => {
        if(feed.remoteFeed.rfid === action.feed.id) {
          feed.remoteFeed.detach();
          return false;
        }
        return true;
      });
      calcDervivedProperties(state, nextState);
      return nextState;
    }
    
    case RECEIVE_REMOTE_FEED: {
      nextState.feeds = nextState.feeds.map(feed => {
        if(feed.remoteFeed.rfid === action.id) {
          feed = Object.assign({}, feed);
          feed.stream = action.stream;
        }
        return feed;
      })
      calcDervivedProperties(state, nextState);
      return nextState;
    }
    
    case LEAVE_VIDEO_ROOM: {
      nextState.localFeed && nextState.localFeed.sfutest.detach();
      nextState.localFeed = null;
      nextState.feeds.map(feed => feed.remoteFeed.detach());
      nextState.feeds = [];
      nextState.chatMessages = [];
      calcDervivedProperties(state, nextState);
      return nextState;
    }
    
    case RECEIVE_AUDIO_BRIDGE_FEED: {
      nextState.audioBridgeFeed = action.feed;
      return nextState;
    }
    
    case LEAVE_AUDIO_BRIDGE: {
      nextState.audioBridgeFeed && nextState.audioBridgeFeed.mixertest.detach();
      nextState.audioBridgeFeed = null;
      return nextState;
    }
    
    case RECEIVE_CURRENT_SHOW_STATE: {
      let {
        currentShow,
        places
      } = action.body;
      nextState.currentShow = currentShow;
      nextState.places = places;
      calcDervivedProperties(state, nextState);
      return nextState;
    }

    case SET_LOCAL_MUTES: {
      nextState.audioMute = action.audioMute;
      nextState.videoMute = action.videoMute;
      return nextState;
    }

    case TOGGLE_NERDINESS: {
      nextState.isNerdy = action.isNerdy;
      localStorage.setItem('isNerdy', action.isNerdy);
      return nextState;
    }

    case TOGGLE_NOTIFICATIONS: {
      nextState.wantsNotifications = action.wantsNotifications;
      localStorage.setItem('wantsNotifications', action.wantsNotifications);
      if(action.wantsNotifications && Notification.permission === 'default'){
        Notification.requestPermission();
      }
      return nextState;
    }

    case PREVIEW_PARTY: {
      nextState.previewedPartyId = action.partyId;
      calcDervivedProperties(state, nextState);
      return nextState;
    }

    default: {
      /* Return original state if no actions were consumed. */
      return state;
    }
  }
}

export default reducer;
