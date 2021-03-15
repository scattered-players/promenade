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
  RECEIVE_SYSTEM_STATE,
  SET_FILTER_NAME,
  GET_LOCAL_FEED_SUCCESS,
  GET_LOCAL_FEED_FAILURE,
  GET_LOCAL_FEED,
  GET_INPUT_DEVICES,
  GET_INPUT_DEVICES_SUCCESS,
  GET_INPUT_DEVICES_FAILURE,
  TOGGLE_NERDINESS,
  TOGGLE_NOTIFICATIONS,
  PREVIEW_PARTY,
  ADJUST_VOLUME,
  TOGGLE_MONITOR,
  TOGGLE_MEDIA_CONSENT,
  FORCE_REFRESH,
  RECEIVE_CUE
} from '../actions/const';

import config from 'config';
import _ from 'lodash';
import { format } from 'date-fns';
import LITE_FILTERS from 'custom/lite-filters';
import playAudio from '../util/audio';

const urlParams = new URLSearchParams(window.location.search);

const initialState = {
  askingMediaConsent: false,
  hasAskedMediaConsent: false,
  isAuthenticating: false,
  triedAuthentication: false,
  isSwitchingInputs: false,
  isGettingInputDevices: false,
  triedGettingInputDevices: false,
  isSettingMutes: false,
  audioInputs: [],
  videoInputs: [],
  chosenVideoInput: null,
  chosenAudioInput: null,
  user: null,
  currentShow: null,
  actors: [],
  places: [],
  currentPlaces: [],
  phases: [],
  myPlaces: [],
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
  janusCoefficient: 0,
  isNerdy: (localStorage.getItem('isNerdy') === 'true') || (urlParams.get('isNerdy') === 'true'),
  wantsNotifications: (localStorage.getItem('wantsNotifications') === 'true'),
  isMonitorOn: (localStorage.getItem('isMonitorOn') === 'true'),
  audioConstraints: {
    echoCancellation: config.SUPPORTED_CONSTRAINTS.echoCancellation && !(localStorage.getItem('echoCancellation') === 'false'),
    autoGainControl: config.SUPPORTED_CONSTRAINTS.autoGainControl && !(localStorage.getItem('autoGainControl') === 'false'),
    noiseSuppression: config.SUPPORTED_CONSTRAINTS.noiseSuppression && !(localStorage.getItem('noiseSuppression') === 'false'),
  },
  mediaPermissions: null,
  activeLiteFilter: null,
  activeLiteFilterName: null
};


function calcDervivedProperties(state, nextState) {
  if(nextState.user && nextState.actors.length) {
    nextState.user = _.find(nextState.actors, actor => actor._id === nextState.user._id) || nextState.user;
  }

  let { user, places } = nextState;

  if (places) {
    nextState.myPlaces = places.filter(place => user.places.reduce((acc, userPlace) => acc || userPlace === place._id, false));
    nextState.currentPlaces = places.filter(place => place.phase && place.phase._id === nextState.currentShow.currentPhase._id);
  } else {
    nextState.myPlaces = [];
    nextState.currentPlaces = [];
  }

  if(nextState.currentShow && nextState.myPlaces) {
    nextState.myCurrentPlace = _.find(nextState.myPlaces, place => place.phase && place.phase._id === nextState.currentShow.currentPhase._id);
  } else {
    nextState.myCurrentPlace = null;
  }

  if (nextState.myCurrentPlace && nextState.myCurrentPlace.currentParty) {
    nextState.currentParty = nextState.myCurrentPlace.currentParty;
  } else {
    nextState.currentParty = null;
  }

  // Handle any notifications
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && nextState.wantsNotifications) {
    if (
      (!state.myCurrentPlace && nextState.myCurrentPlace && nextState.myCurrentPlace.partyQueue.length) || 
      (state.myCurrentPlace && nextState.myCurrentPlace && nextState.myCurrentPlace.partyQueue.length > state.myCurrentPlace.partyQueue.length)
    ) {
      let newParty = nextState.myCurrentPlace.partyQueue.slice(-1)[0];
      new Notification(`Incoming party`, {
        body: `${newParty.name} has joined your party queue`,
        badge: '/favicons/actor-touch-icon-iphone-retina.png',
        icon: '/favicons/actor-touch-icon-iphone-retina.png',
        silent: false
      });
    }

    if(state.currentShow && nextState.currentShow && !state.currentShow.hasIntroAlert && nextState.currentShow.hasIntroAlert) {
      let dateString = format(new Date(nextState.currentShow.date), 'h:mm a');
      new Notification(`Intro Alert!`, {
        body: `The ${dateString} show is about to watch the Intro`,
        badge: '/favicons/actor-touch-icon-iphone-retina.png',
        icon: '/favicons/actor-touch-icon-iphone-retina.png',
        silent: false
      });
    }

    if(state.currentShow && nextState.currentShow && !state.currentShow.hasEndingAlert && nextState.currentShow.hasEndingAlert) {
      let dateString = format(new Date(nextState.currentShow.date), 'h:mm a');
      new Notification(`Ending Alert!`, {
        body: `The ${dateString} show Freeplay is about to end.`,
        badge: '/favicons/actor-touch-icon-iphone-retina.png',
        icon: '/favicons/actor-touch-icon-iphone-retina.png',
        silent: false
      });
    }

    if(state.currentShow && nextState.currentShow && state.currentShow.state !== 'FREEPLAY' && nextState.currentShow.state === 'FREEPLAY') {
      let dateString = format(new Date(nextState.currentShow.date), 'h:mm a');
      new Notification(`Get ready!`, {
        body: `The ${dateString} show has entered Freeplay Mode`,
        badge: '/favicons/actor-touch-icon-iphone-retina.png',
        icon: '/favicons/actor-touch-icon-iphone-retina.png',
        silent: false
      });
    }

    if(state.currentShow && nextState.currentShow && state.currentShow.state === 'FREEPLAY' && nextState.currentShow.state !== 'FREEPLAY') {
      let dateString = format(new Date(nextState.currentShow.date), 'h:mm a');
      new Notification(`Aaaaand Break!`, {
        body: `The ${dateString} show has ended Freeplay Mode`,
        badge: '/favicons/actor-touch-icon-iphone-retina.png',
        icon: '/favicons/actor-touch-icon-iphone-retina.png',
        silent: false
      });
    }
  }

  // Handle changes to filters
  if(nextState.myCurrentPlace && nextState.gotInputFeed) {
    if (nextState.activeLiteFilterName != nextState.myCurrentPlace.currentFilter) {
      nextState.activeLiteFilterName = nextState.myCurrentPlace.currentFilter;
      if(nextState.activeLiteFilter) {
        nextState.activeLiteFilter.destroy();
        nextState.activeLiteFilter = null;
      }

      if(nextState.activeLiteFilterName) {
        nextState.activeLiteFilter = new LITE_FILTERS[nextState.activeLiteFilterName]({
          audioSource: nextState.audioSource,
          mixerContext: nextState.mixerContext,
          mixerOutput: nextState.mixerOutput
        });
      } else if(nextState.audioSource && state.audioSource !== nextState.audioSource){
        nextState.audioSource.connect(nextState.mixerOutput);
      }
    } else if (nextState.activeLiteFilter && state.audioSource !== nextState.audioSource) {
      nextState.activeLiteFilter.destroy();
      nextState.activeLiteFilter = new LITE_FILTERS[nextState.activeLiteFilterName]({
        audioSource: nextState.audioSource,
        mixerContext: nextState.mixerContext,
        mixerOutput: nextState.mixerOutput
      });
    } else if (!nextState.activeLiteFilter && nextState.audioSource && state.audioSource !== nextState.audioSource) {
      nextState.audioSource.connect(nextState.mixerOutput);
    }
  }

  if (nextState.currentParty) {
    nextState.previewedPartyId = null;
    nextState.chatMessages = nextState.currentParty.chat;
    if(nextState.currentParty.guide) {
      let matchingFeeds = nextState.feeds.filter(feed => feed.remoteFeed.rfdisplay.slice(6) === nextState.currentParty.guide._id);
      if(matchingFeeds && matchingFeeds.length) {
        nextState.currentParty.guide.feed = matchingFeeds[0];
      }
    }

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
      nextState.isSwitchingInputs = true;
      nextState.chosenAudioInput = action.audioDeviceId;
      localStorage.setItem('chosenAudioInput', action.audioDeviceId);
      nextState.chosenVideoInput = action.videoDeviceId;
      localStorage.setItem('chosenVideoInput', action.videoDeviceId);
      nextState.audioConstraints = action.audioConstraints;
      localStorage.setItem('echoCancellation', action.audioConstraints.echoCancellation);
      localStorage.setItem('autoGainControl', action.audioConstraints.autoGainControl);
      localStorage.setItem('noiseSuppression', action.audioConstraints.noiseSuppression);
      calcDervivedProperties(state, nextState);
      nextState.user.isAudioMuted = action.audioDeviceId === 'NONE';
      nextState.user.isVideoMuted = action.videoDeviceId === 'NONE';
      return nextState;
    }
    
    case GET_LOCAL_FEED_FAILURE: {
      nextState.isGettingInputFeed = false;
      nextState.isSwitchingInputs = false;
      nextState.gotInputFeed = false;
      nextState.localInputStream = null;
      return nextState;
    }
    
    case GET_LOCAL_FEED_SUCCESS: {
      nextState.mediaPermissions = action.permissions;
      nextState.isGettingInputFeed = false;
      nextState.isSwitchingInputs = false;
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
      calcDervivedProperties(state, nextState);
      return nextState;
    }
    
    case SET_LOCAL_STREAM: {
      nextState.localOutputStream = action.stream;
      return nextState;
    }
    
    case GET_INPUT_DEVICES: {
      nextState.isGettingInputDevices = true;
      nextState.triedGettingInputDevices = false;
      return nextState;
    }
    
    case GET_INPUT_DEVICES_SUCCESS: {
      nextState.mediaPermissions = action.permissions;
      nextState.videoInputs = [{ label: 'No Camera', deviceId: 'NONE', kind: 'videoinput'}, ...action.devices.filter(device => device.kind === 'videoinput')];
      nextState.audioInputs = [{ label: 'No Microphone', deviceId: 'NONE', kind: 'audioinput'}, ...action.devices.filter(device => device.kind === 'audioinput')];
      nextState.askingMediaConsent = false;
      nextState.hasAskedMediaConsent = true;
      nextState.isGettingInputDevices = false;
      nextState.triedGettingInputDevices = true;
      return nextState;
    }
    
    case GET_INPUT_DEVICES_FAILURE: {
      nextState.askingMediaConsent = false;
      nextState.hasAskedMediaConsent = true;
      nextState.isGettingInputDevices = false;
      nextState.triedGettingInputDevices = true;
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
        if(feed.remoteFeed.rfdisplay === action.id) {
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
        janusCoefficient,
        currentShow,
        places,
        phases
      } = action.body;
      nextState.janusCoefficient = janusCoefficient;
      nextState.isSettingMutes = false;
      nextState.currentShow = currentShow;
      nextState.places = places;
      nextState.phases = phases;
      calcDervivedProperties(state, nextState);
      return nextState;
    }
    
    case RECEIVE_SYSTEM_STATE: {
      let {
        actors
      } = action.body;
      nextState.actors = actors;
      calcDervivedProperties(state, nextState);
      return nextState;
    }

    case SET_LOCAL_MUTES: {
      nextState.isSettingMutes = true;
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
      if(typeof Notification !== 'undefined' && action.wantsNotifications && Notification.permission === 'default'){
        Notification.requestPermission();
      }
      return nextState;
    }

    case PREVIEW_PARTY: {
      nextState.previewedPartyId = action.partyId;
      calcDervivedProperties(state, nextState);
      return nextState;
    }

    case ADJUST_VOLUME: {
      nextState.myCurrentPlace.audioVolume = action.audioVolume;
      return nextState;
    }

    case TOGGLE_MONITOR: {
      nextState.isMonitorOn = action.isMonitorOn;
      localStorage.setItem('isMonitorOn', action.isMonitorOn);
      return nextState;
    }

    case TOGGLE_MEDIA_CONSENT: {
      nextState.askingMediaConsent = action.askingMediaConsent;
      return nextState;
    }

    case FORCE_REFRESH: {
      location.reload();
      return nextState;
    }

    case RECEIVE_CUE: {
      if(action.cue.audioPath){
        playAudio(action.cue.audioPath);
      }
      if(action.cue.cssClass){
        document.documentElement.classList.add(action.cue.cssClass);
        setTimeout(() => {
          document.documentElement.classList.remove(action.cue.cssClass);
        }, action.cue.duration);
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
