/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  RECEIVE_BOOKED_SHOWS,
  RECEIVE_CURRENT_SHOW_STATE,
  ATTACH_LOCAL_FEED,
  ATTACH_REMOTE_FEED,
  DETACH_REMOTE_FEED,
  RECEIVE_REMOTE_FEED,
  RECEIVE_ACTOR_FEED,
  REMOVE_ACTOR_FEED,
  LEAVE_VIDEO_ROOM,
  LEAVE_STREAM,
  RECEIVE_AUDIO_BRIDGE_FEED,
  LEAVE_AUDIO_BRIDGE,
  SET_LOCAL_MUTES,
  SET_STREAMING_STREAM,
  SEND_CHAT_MESSAGE,
  APPEND_CHAT_MESSAGE,
  WERE_BLOCKED,
  GET_LOCAL_STREAM,
  GET_LOCAL_STREAM_SUCCESS,
  GET_LOCAL_STREAM_FAILURE,
  GET_INPUT_DEVICES,
  GET_INPUT_DEVICES_SUCCESS,
  GET_INPUT_DEVICES_FAILURE,
  JOIN_ECHO_TEST,
  JOIN_ECHO_TEST_FAILURE,
  JOIN_ECHO_TEST_SUCCESS,
  RECEIVE_ECHO_STREAM,
  LEAVE_ECHO_TEST,
  TOGGLE_NERDINESS,
  TOGGLE_MEDIA_CONSENT,
  TOGGLE_NAV_MUSIC,
  TOGGLE_VISUAL_CUES,
  FORCE_REFRESH,
  JANUS_SESSION_CREATED,
  RECEIVE_AUDIO_CUE,
  RECEIVE_CUE
} from '../actions/const';

import LITE_FILTERS from 'custom/lite-filters';

import playAudio from '../util/audio';

const urlParams = new URLSearchParams(window.location.search);



const initialState = {
  error: null,
  isSettingMutes: false,
  isGettingMediaDevices: false,
  hasGottenMediaDevices: false,
  askingMediaConsent: false,
  hasAskedMediaConsent: false,
  isSwitchingInputs: false,
  mediaPermissions: null,
  audioInputs: [],
  videoInputs: [],
  chosenVideoInput: undefined,
  chosenAudioInput: undefined,
  isAuthenticating: false,
  triedAuthentication: false,
  user: null,
  bookedShows: [],
  places: [],
  currentPlaces: [],
  phases: [],
  currentShow: null,
  currentPlace: null,
  isInCurrentShow: false,
  myParty: null,
  feeds: [],
  echotest: null,
  echoLocalStream: null,
  echoRemoteStream: null,
  localFeed: null,
  actorFeed: null,
  audioBridgeFeed: null,
  audioMute: false,
  videoMute: false,
  isBlocked: false,
  chatMessages: [],
  streamingFeed: null,
  videoRoomSession: null,
  isNerdy: (localStorage.getItem('isNerdy') === 'true') || (urlParams.get('isNerdy') === 'true'),
  muteNavMusic:false,
  activeLiteFilter: null,
  activeLiteFilterName: null,
  shouldShowVisualCues: (localStorage.getItem('shouldShowVisualCues') !== 'false'),
  janusCoefficient: 0
};

function calcDervivedProperties(nextState) {
  let { currentShow, bookedShows, user, places } = nextState;

  let isInCurrentShow = currentShow && bookedShows.map(show => show._id).indexOf(currentShow._id) !== -1;
  nextState.isInCurrentShow = isInCurrentShow;

  if (user && isInCurrentShow) {
    let matchingParties = nextState.currentShow.parties.filter(party => party.attendees.reduce((acc, attendee) => acc || attendee._id === user._id, false));
    nextState.myParty = matchingParties.length ? matchingParties[0] : null;
  } else {
    nextState.myParty = null;
  }

  if(nextState.myParty) {
    if (places) {
      nextState.currentPlaces = places.filter(place => place.phase._id === nextState.currentShow.currentPhase._id);
    } else {
      nextState.currentPlaces = [];
    }

    nextState.chatMessages = nextState.myParty.chat;
    if(nextState.myParty.guide) {
      let matchingFeeds = nextState.feeds.filter(feed => feed.remoteFeed.rfdisplay.slice(6) === nextState.myParty.guide._id);
      if(matchingFeeds.length) {
        nextState.myParty.guide.feed = matchingFeeds[0];
      }
    }

    nextState.myParty.attendees = nextState.myParty.attendees.map(attendee => {
      if(attendee._id === user._id){
        nextState.user = attendee;
        nextState.audioMute
        if(attendee.isBlocked){
          nextState.isBlocked = true;
          location.reload();
        }
      }

      let matchingFeeds = nextState.feeds.filter(feed => feed.remoteFeed.rfdisplay.slice(9) === attendee._id);
      if(matchingFeeds.length) {
        attendee = Object.assign({}, attendee);
        attendee.feed = matchingFeeds[0];
      }
      return attendee;
    });

    if(nextState.myParty.currentPlace) {
      nextState.currentPlace = nextState.myParty.currentPlace
    }
  } else {
    nextState.chatMessages = [];
    nextState.currentPlaces = [];
  }

  
  if (nextState.currentPlace) {
    if (nextState.activeLiteFilterName != nextState.currentPlace.currentFilter) {
      nextState.activeLiteFilterName = nextState.currentPlace.currentFilter;
      if(nextState.activeLiteFilter) {
        nextState.activeLiteFilter.destroy();
        nextState.activeLiteFilter = null;
      }

      if(nextState.activeLiteFilterName) {
        nextState.activeLiteFilter = new LITE_FILTERS[nextState.activeLiteFilterName]({});
      }
    }
  } else if (nextState.activeLiteFilterName) {
    nextState.activeLiteFilterName = null
    if(nextState.activeLiteFilter) {
      nextState.activeLiteFilter.destroy();
      nextState.activeLiteFilter = null;
    }
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
      nextState.error = action.error;
      return nextState;
    }
    
    case GET_LOCAL_STREAM: {
      nextState.isSwitchingInputs = true;
      nextState.chosenAudioInput = action.audioDeviceId;
      localStorage.setItem('chosenAudioInput', action.audioDeviceId);
      nextState.chosenVideoInput = action.videoDeviceId;
      localStorage.setItem('chosenVideoInput', action.videoDeviceId);
      calcDervivedProperties(nextState);
      nextState.user.isAudioMuted = action.audioDeviceId === 'NONE';
      nextState.user.isVideoMuted = action.videoDeviceId === 'NONE';
      return nextState;
    }
    
    case GET_LOCAL_STREAM_SUCCESS: {
      nextState.localStream = action.stream;
      nextState.mediaPermissions = action.permissions;
      nextState.isSwitchingInputs = false;
      return nextState;
    }
    
    case GET_LOCAL_STREAM_FAILURE: {
      nextState.isSwitchingInputs = false;
      nextState.error = action.error;
      return nextState;
    }
    
    case GET_INPUT_DEVICES: {
      nextState.isGettingMediaDevices = true;
      return nextState;
    }
    
    case GET_INPUT_DEVICES_SUCCESS: {
      nextState.mediaPermissions = action.permissions;
      nextState.videoInputs = [{ label: 'No Camera', deviceId: 'NONE', kind: 'videoinput'}, ...action.devices.filter(device => device.kind === 'videoinput')];
      nextState.audioInputs = [{ label: 'No Microphone', deviceId: 'NONE', kind: 'audioinput'}, ...action.devices.filter(device => device.kind === 'audioinput')];
      nextState.askingMediaConsent = false;
      nextState.hasAskedMediaConsent = true;
      nextState.isGettingMediaDevices = false;
      nextState.hasGottenMediaDevices = true;
      return nextState;
    }
    
    case GET_INPUT_DEVICES_FAILURE: {
      nextState.askingMediaConsent = false;
      nextState.hasAskedMediaConsent = true;
      nextState.isGettingMediaDevices = false;
      nextState.hasGottenMediaDevices = true;
      nextState.error = action.error;
      return nextState;
    }

    case JANUS_SESSION_CREATED: {
      nextState.videoRoomSession = action.session;
      return nextState;

    }
    
    case ATTACH_LOCAL_FEED: {
      nextState.localFeed = action.feed;
      return nextState;
    }
    
    case ATTACH_REMOTE_FEED: {
      nextState.feeds = [...nextState.feeds, action.feed];
      calcDervivedProperties(nextState);
      return nextState;
    }
    
    case RECEIVE_ACTOR_FEED: {
      let { feed } = action;
      if (!nextState.currentPlace || nextState.currentPlace._id === feed.remoteFeed.rfdisplay.slice(6)) {
        console.log('ACTOR ACCEPTED');
        nextState.actorFeed && nextState.actorFeed.remoteFeed.rfid !== feed.remoteFeed.rfid && nextState.actorFeed.remoteFeed.detach();
        nextState.actorFeed = action.feed;
      } else {
        console.log('ACTOR REJECTED');
      }
      return nextState;
    }
    
    case REMOVE_ACTOR_FEED: {
      nextState.actorFeed && nextState.actorFeed.remoteFeed.detach();
      nextState.actorFeed = null;
      return nextState;
    }
    
    case DETACH_REMOTE_FEED: {
      if(nextState.actorFeed && nextState.actorFeed.remoteFeed.rfid === action.feed.id){
        nextState.actorFeed.remoteFeed.detach();
        nextState.actorFeed = null;
      } else {
        nextState.feeds = nextState.feeds.filter(feed => {
          if(feed.remoteFeed.rfid === action.feed.id) {
            feed.remoteFeed.detach();
            return false;
          }
          return true;
        });
      }
      calcDervivedProperties(nextState);
      return nextState;
    }
    
    case RECEIVE_REMOTE_FEED: {
      nextState.feeds = nextState.feeds.map(feed => {
        if(feed.remoteFeed.rfdisplay === action.display) {
          feed = Object.assign({}, feed);
          feed.stream = action.stream;
        }
        return feed;
      })
      calcDervivedProperties(nextState);
      return nextState;
    }
    
    case LEAVE_VIDEO_ROOM: {
      // if(nextState.videoRoomSession){
      //   console.log('DESTROYING SESSION', nextState.videoRoomSession);
      //   nextState.videoRoomSession.destroy();
      // } 
      nextState.videoRoomSession = null;
      nextState.localFeed && nextState.localFeed.sfutest.hangup();
      nextState.localFeed = null;
      nextState.actorFeed && nextState.actorFeed.remoteFeed.hangup();
      nextState.actorFeed = null;
      nextState.feeds.map(feed => feed.remoteFeed.hangup());
      nextState.feeds = [];
      calcDervivedProperties(nextState);
      return nextState;
    }

    case JOIN_ECHO_TEST_SUCCESS:{
      nextState.echotest && nextState.echotest.detach();
      nextState.echotest = action.echotest;
      nextState.echoLocalStream = action.stream;
      return nextState;
    }

    case RECEIVE_ECHO_STREAM: {
      nextState.echoRemoteStream = action.stream;
      return nextState;
    }

    case LEAVE_ECHO_TEST:{
      nextState.echotest && nextState.echotest.detach();
      nextState.echotest = null;
      nextState.echoLocalStream = null;
      nextState.echoRemoteStream = null;
      return nextState;
    }
    
    case SET_STREAMING_STREAM: {
      nextState.streamingFeed = action.feed;
      return nextState;
    }
    
    case LEAVE_STREAM: {
      nextState.streamingFeed && nextState.streamingFeed.streaming.detach();
      nextState.streamingFeed = null;
      return nextState;
    }
    
    case RECEIVE_BOOKED_SHOWS: {
      nextState.bookedShows = action.body.bookedShows;
      calcDervivedProperties(nextState);
      return nextState;
    }

    case RECEIVE_CURRENT_SHOW_STATE: {
      let {
        currentShow,
        places,
        phases,
        janusCoefficient
      } = action.body;
      nextState.janusCoefficient = janusCoefficient;
      nextState.isSettingMutes = false;
      nextState.currentShow = currentShow;
      nextState.places = places;
      nextState.phases = phases;
      calcDervivedProperties(nextState);
      return nextState;
    }

    case SET_LOCAL_MUTES: {
      nextState.isSettingMutes = true;
      nextState.audioMute = action.audioMute;
      nextState.videoMute = action.videoMute;
      return nextState;
    }

    case WERE_BLOCKED: {
      nextState.isBlocked = true;
      return nextState;
    }

    case TOGGLE_NERDINESS: {
      nextState.isNerdy = action.isNerdy;
      localStorage.setItem('isNerdy', action.isNerdy);
      return nextState;
    }

    case TOGGLE_VISUAL_CUES: {
      nextState.shouldShowVisualCues = action.shouldShowVisualCues;
      localStorage.setItem('shouldShowVisualCues', action.shouldShowVisualCues);
      return nextState;
    }

    case TOGGLE_MEDIA_CONSENT: {
      nextState.askingMediaConsent = action.askingMediaConsent;
      return nextState;
    }

    case TOGGLE_NAV_MUSIC: {
      nextState.muteNavMusic = action.muteNavMusic;
      return nextState;
    }

    case FORCE_REFRESH: {
      location.reload();
      return nextState;
    }

    case RECEIVE_AUDIO_CUE: {
      if(nextState.isInCurrentShow){
        playAudio(action.audioPath);
      }
      return nextState;
    }

    case RECEIVE_CUE: {
      if(nextState.isInCurrentShow){
        if(action.cue.audioPath){
          playAudio(action.cue.audioPath);
        }
        if(action.cue.cssClass && nextState.shouldShowVisualCues){
          document.documentElement.classList.add(action.cue.cssClass);
          setTimeout(() => {
            document.documentElement.classList.remove(action.cue.cssClass);
          }, action.cue.duration);
        }
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
