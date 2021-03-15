/* eslint-disable import/newline-after-import */
/* Exports all the actions from a single point.

Allows to import actions like so:

import {action1, action2} from '../actions/'
*/
/* Populated by react-webpack-redux:action */
import toggleMegaphone from '../actions/toggleMegaphone.js';
import setCharacterName from '../actions/setCharacterName.js';
import toggleVisualCues from '../actions/toggleVisualCues.js';
import receiveCue from '../actions/receiveCue.js';
import forceRefreshUser from '../actions/forceRefreshUser.js';
import blockUser from '../actions/blockUser.js';
import setRemoteMutes from '../actions/setRemoteMutes.js';
import chooseEnding from '../actions/chooseEnding.js';
import writeNotes from '../actions/writeNotes.js';
import receiveAudioCue from '../actions/receiveAudioCue.js';
import janusSessionCreated from '../actions/janusSessionCreated.js';
import forceRefresh from '../actions/forceRefresh.js';
import reportSlowlink from '../actions/reportSlowlink.js';
import toggleNavMusic from '../actions/toggleNavMusic.js';
import reportError from '../actions/reportError.js';
import toggleNerdiness from '../actions/toggleNerdiness.js';
import toggleMediaConsent from '../actions/toggleMediaConsent.js';
import receiveEchoStream from '../actions/receiveEchoStream.js';
import leaveEchoTest from '../actions/leaveEchoTest.js';
import joinEchoTestFailure from '../actions/joinEchoTestFailure.js';
import joinEchoTestSuccess from '../actions/joinEchoTestSuccess.js';
import joinEchoTest from '../actions/joinEchoTest.js';
import getInputDevicesFailure from '../actions/getInputDevicesFailure.js';
import getInputDevicesSuccess from '../actions/getInputDevicesSuccess.js';
import getInputDevices from '../actions/getInputDevices.js';
import changeUsername from '../actions/changeUsername.js';
import getLocalStreamFailure from '../actions/getLocalStreamFailure.js';
import getLocalStreamSuccess from '../actions/getLocalStreamSuccess.js';
import getLocalStream from '../actions/getLocalStream.js';
import setStreamingStream from '../actions/setStreamingStream.js';
import streamFailure from '../actions/streamFailure.js';
import leaveStream from '../actions/leaveStream.js';
import joinStream from '../actions/joinStream.js';
import wereBlocked from '../actions/wereBlocked.js';
import queueAtPlaceFailure from '../actions/queueAtPlaceFailure.js';
import queueAtPlaceSuccess from '../actions/queueAtPlaceSuccess.js';
import queueAtPlace from '../actions/queueAtPlace.js';
import removeActorFeed from '../actions/removeActorFeed.js';
import receiveActorFeed from '../actions/receiveActorFeed.js';
import selectPlaceFailure from '../actions/selectPlaceFailure.js';
import selectPlaceSuccess from '../actions/selectPlaceSuccess.js';
import selectPlace from '../actions/selectPlace.js';
import sendChatMessage from '../actions/sendChatMessage.js';
import appendChatMessage from '../actions/appendChatMessage.js';
import setLocalMutes from '../actions/setLocalMutes.js';
import receiveAudioBridgeFeed from '../actions/receiveAudioBridgeFeed.js';
import attachLocalFeed from '../actions/attachLocalFeed.js';
import detachRemoteFeed from '../actions/detachRemoteFeed.js';
import attachRemoteFeed from '../actions/attachRemoteFeed.js';
import removeRemoteFeed from '../actions/removeRemoteFeed.js';
import receiveRemoteFeed from '../actions/receiveRemoteFeed.js';
import changeVideoRoomParticipants from '../actions/changeVideoRoomParticipants.js';
import leaveVideoRoomFailure from '../actions/leaveVideoRoomFailure.js';
import leaveVideoRoomSuccess from '../actions/leaveVideoRoomSuccess.js';
import leaveVideoRoom from '../actions/leaveVideoRoom.js';
import joinVideoRoomFailure from '../actions/joinVideoRoomFailure.js';
import joinVideoRoomSuccess from '../actions/joinVideoRoomSuccess.js';
import joinVideoRoom from '../actions/joinVideoRoom.js';
import leaveAudioBridgeFailure from '../actions/leaveAudioBridgeFailure.js';
import leaveAudioBridgeSuccess from '../actions/leaveAudioBridgeSuccess.js';
import leaveAudioBridge from '../actions/leaveAudioBridge.js';
import joinAudioBridgeFailure from '../actions/joinAudioBridgeFailure.js';
import joinAudioBridgeSuccess from '../actions/joinAudioBridgeSuccess.js';
import joinAudioBridge from '../actions/joinAudioBridge.js';
import loginFailure from '../actions/loginFailure.js';
import loginSuccess from '../actions/loginSuccess.js';
import login from '../actions/login.js';
import receiveCurrentShowState from '../actions/receiveCurrentShowState.js';
import receiveBookedShows from '../actions/receiveBookedShows.js';
import receiveShowStatus from '../actions/receiveShowStatus.js';
import dismissSnackbar from '../actions/dismissSnackbar.js';
import showSnackbar from '../actions/showSnackbar.js';
import lostContactWithShowService from '../actions/lostContactWithShowService.js';
import contactShowServiceSuccess from '../actions/contactShowServiceSuccess.js';
import contactShowService from '../actions/contactShowService.js';
const actions = {
  contactShowService,
  contactShowServiceSuccess,
  lostContactWithShowService,
  showSnackbar,
  dismissSnackbar,
  receiveShowStatus,
  receiveBookedShows,
  receiveCurrentShowState,
  login,
  loginSuccess,
  loginFailure,
  joinAudioBridge,
  joinAudioBridgeSuccess,
  joinAudioBridgeFailure,
  leaveAudioBridge,
  leaveAudioBridgeSuccess,
  leaveAudioBridgeFailure,
  joinVideoRoom,
  joinVideoRoomSuccess,
  joinVideoRoomFailure,
  leaveVideoRoom,
  leaveVideoRoomSuccess,
  leaveVideoRoomFailure,
  changeVideoRoomParticipants,
  receiveRemoteFeed,
  removeRemoteFeed,
  attachRemoteFeed,
  detachRemoteFeed,
  attachLocalFeed,
  receiveAudioBridgeFeed,
  setLocalMutes,
  appendChatMessage,
  sendChatMessage,
  selectPlace,
  selectPlaceSuccess,
  selectPlaceFailure,
  receiveActorFeed,
  removeActorFeed,
  queueAtPlace,
  queueAtPlaceSuccess,
  queueAtPlaceFailure,
  wereBlocked,
  joinStream,
  leaveStream,
  streamFailure,
  setStreamingStream,
  getLocalStream,
  getLocalStreamSuccess,
  getLocalStreamFailure,
  changeUsername,
  getInputDevices,
  getInputDevicesSuccess,
  getInputDevicesFailure,
  joinEchoTest,
  joinEchoTestSuccess,
  joinEchoTestFailure,
  leaveEchoTest,
  receiveEchoStream,
  toggleMediaConsent,
  toggleNerdiness,
  reportError,
  toggleNavMusic,
  reportSlowlink,
  forceRefresh,
  janusSessionCreated,
  receiveAudioCue,
  writeNotes,
  chooseEnding,
  setRemoteMutes,
  blockUser,
  forceRefreshUser,
  receiveCue,
  toggleVisualCues,
  setCharacterName,
  toggleMegaphone
};
module.exports = actions;
