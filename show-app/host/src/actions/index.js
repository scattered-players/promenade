/* eslint-disable import/newline-after-import */
/* Exports all the actions from a single point.

Allows to import actions like so:

import {action1, action2} from '../actions/'
*/
/* Populated by react-webpack-redux:action */
import sendToOutroVideo from '../actions/sendToOutroVideo.js';
import activateAnsible from '../actions/activateAnsible.js';
import pullItem from '../actions/pullItem.js';
import chooseShip from '../actions/chooseShip.js';
import reportError from '../actions/reportError.js';
import previewParty from '../actions/previewParty.js';
import toggleNotifications from '../actions/toggleNotifications.js';
import takeItem from '../actions/takeItem.js';
import toggleNerdiness from '../actions/toggleNerdiness.js';
import getInputDevicesFailure from '../actions/getInputDevicesFailure.js';
import getInputDevicesSuccess from '../actions/getInputDevicesSuccess.js';
import getInputDevices from '../actions/getInputDevices.js';
import changePlace from '../actions/changePlace.js';
import changeUsername from '../actions/changeUsername.js';
import setRemoteMutes from '../actions/setRemoteMutes.js';
import blockUser from '../actions/blockUser.js';
import giveItem from '../actions/giveItem.js';
import getLocalFeedFailure from '../actions/getLocalFeedFailure.js';
import getLocalFeedSuccess from '../actions/getLocalFeedSuccess.js';
import getLocalFeed from '../actions/getLocalFeed.js';
import setFilterName from '../actions/setFilterName.js';
import setLocalStream from '../actions/setLocalStream.js';
import sendChatMessage from '../actions/sendChatMessage.js';
import appendChatMessage from '../actions/appendChatMessage.js';
import setLocalMutes from '../actions/setLocalMutes.js';
import receiveAudioBridgeFeed from '../actions/receiveAudioBridgeFeed.js';
import attachLocalFeed from '../actions/attachLocalFeed.js';
import detachRemoteFeed from '../actions/detachRemoteFeed.js';
import attachRemoteFeed from '../actions/attachRemoteFeed.js';
import receiveRemoteFeed from '../actions/receiveRemoteFeed.js';
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
import kickPartyFailure from '../actions/kickPartyFailure.js';
import kickPartySuccess from '../actions/kickPartySuccess.js';
import kickParty from '../actions/kickParty.js';
import acceptPartyFailure from '../actions/acceptPartyFailure.js';
import acceptPartySuccess from '../actions/acceptPartySuccess.js';
import acceptParty from '../actions/acceptParty.js';
import loginSuccess from '../actions/loginSuccess.js';
import loginFailure from '../actions/loginFailure.js';
import login from '../actions/login.js';
import receiveCurrentShowState from '../actions/receiveCurrentShowState.js';
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
  receiveCurrentShowState,
  login,
  loginFailure,
  loginSuccess,
  acceptParty,
  acceptPartySuccess,
  acceptPartyFailure,
  kickParty,
  kickPartySuccess,
  kickPartyFailure,
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
  receiveRemoteFeed,
  attachRemoteFeed,
  detachRemoteFeed,
  attachLocalFeed,
  receiveAudioBridgeFeed,
  setLocalMutes,
  appendChatMessage,
  sendChatMessage,
  setLocalStream,
  setFilterName,
  getLocalFeed,
  getLocalFeedSuccess,
  getLocalFeedFailure,
  giveItem,
  blockUser,
  setRemoteMutes,
  changeUsername,
  changePlace,
  getInputDevices,
  getInputDevicesSuccess,
  getInputDevicesFailure,
  toggleNerdiness,
  takeItem,
  toggleNotifications,
  previewParty,
  reportError,
  chooseShip,
  pullItem,
  activateAnsible,
  sendToOutroVideo
};
module.exports = actions;
