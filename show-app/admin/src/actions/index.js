/* eslint-disable import/newline-after-import */
/* Exports all the actions from a single point.

Allows to import actions like so:

import {action1, action2} from '../actions/'
*/
/* Populated by react-webpack-redux:action */
import deletePlace from '../actions/deletePlace.js';
import createPlace from '../actions/createPlace.js';
import setDefaultPhase from '../actions/setDefaultPhase.js';
import swapPhases from '../actions/swapPhases.js';
import deletePhase from '../actions/deletePhase.js';
import updatePhase from '../actions/updatePhase.js';
import createPhase from '../actions/createPhase.js';
import getStreamKey from '../actions/getStreamKey.js';
import deleteScene from '../actions/deleteScene.js';
import deleteHistoryEntry from '../actions/deleteHistoryEntry.js';
import toggleNotifications from '../actions/toggleNotifications.js';
import sendCue from '../actions/sendCue.js';
import setPartyGuide from '../actions/setPartyGuide.js';
import deleteGuide from '../actions/deleteGuide.js';
import createGuide from '../actions/createGuide.js';
import sendAudioCue from '../actions/sendAudioCue.js';
import refreshEventbrite from '../actions/refreshEventbrite.js';
import moveAttendee from '../actions/moveAttendee.js';
import fetchShowEmailCsv from '../actions/fetchShowEmailCsv.js';
import forceRefresh from '../actions/forceRefresh.js';
import forceRefreshUser from '../actions/forceRefreshUser.js';
import refreshSlowlinkData from '../actions/refreshSlowlinkData.js';
import reportSlowlink from '../actions/reportSlowlink.js';
import cencelAlerts from '../actions/cencelAlerts.js';
import sendEndingAlert from '../actions/sendEndingAlert.js';
import sendIntroAlert from '../actions/sendIntroAlert.js';
import sendShowEmail from '../actions/sendShowEmail.js';
import sendError from '../actions/sendError.js';
import reportLogin from '../actions/reportLogin.js';
import reportError from '../actions/reportError.js';
import deleteAdmin from '../actions/deleteAdmin.js';
import deleteActor from '../actions/deleteActor.js';
import updateShowInfo from '../actions/updateShowInfo.js';
import deleteShow from '../actions/deleteShow.js';
import kickPartyFailure from '../actions/kickPartyFailure.js';
import kickPartySuccess from '../actions/kickPartySuccess.js';
import kickParty from '../actions/kickParty.js';
import getMagicLinkFailure from '../actions/getMagicLinkFailure.js';
import getMagicLinkSuccess from '../actions/getMagicLinkSuccess.js';
import getMagicLink from '../actions/getMagicLink.js';
import createAdminFailure from '../actions/createAdminFailure.js';
import createAdminSuccess from '../actions/createAdminSuccess.js';
import createAdmin from '../actions/createAdmin.js';
import createActorFailure from '../actions/createActorFailure.js';
import createActorSuccess from '../actions/createActorSuccess.js';
import createActor from '../actions/createActor.js';
import loginFailure from '../actions/loginFailure.js';
import loginSuccess from '../actions/loginSuccess.js';
import login from '../actions/login.js';
import receiveCurrentShowState from '../actions/receiveCurrentShowState.js';
import bookTicketFailure from '../actions/bookTicketFailure.js';
import bookTicketSuccess from '../actions/bookTicketSuccess.js';
import bookTicket from '../actions/bookTicket.js';
import changeShowRunningFailure from '../actions/changeShowRunningFailure.js';
import changeShowRunningSuccess from '../actions/changeShowRunningSuccess.js';
import changeShowRunning from '../actions/changeShowRunning.js';
import changeShowStatusFailure from '../actions/changeShowStatusFailure.js';
import changeShowStatusSuccess from '../actions/changeShowStatusSuccess.js';
import changeShowStatus from '../actions/changeShowStatus.js';
import dismissSnackbar from '../actions/dismissSnackbar.js';
import showSnackbar from '../actions/showSnackbar.js';
import scheduleShowFailure from '../actions/scheduleShowFailure.js';
import scheduleShowSuccess from '../actions/scheduleShowSuccess.js';
import scheduleShow from '../actions/scheduleShow.js';
import lostContactWithShowService from '../actions/lostContactWithShowService.js';
import contactShowServiceSuccess from '../actions/contactShowServiceSuccess.js';
import receiveSystemState from '../actions/receiveSystemState.js';
import contactShowService from '../actions/contactShowService.js';
const actions = {
  contactShowService,
  receiveSystemState,
  contactShowServiceSuccess,
  lostContactWithShowService,
  scheduleShow,
  scheduleShowSuccess,
  scheduleShowFailure,
  showSnackbar,
  dismissSnackbar,
  changeShowStatus,
  changeShowStatusSuccess,
  changeShowStatusFailure,
  changeShowRunning,
  changeShowRunningSuccess,
  changeShowRunningFailure,
  bookTicket,
  bookTicketSuccess,
  bookTicketFailure,
  receiveCurrentShowState,
  login,
  loginSuccess,
  loginFailure,
  createActor,
  createActorSuccess,
  createActorFailure,
  createAdmin,
  createAdminSuccess,
  createAdminFailure,
  getMagicLink,
  getMagicLinkSuccess,
  getMagicLinkFailure,
  kickParty,
  kickPartySuccess,
  kickPartyFailure,
  deleteShow,
  updateShowInfo,
  deleteActor,
  deleteAdmin,
  reportError,
  reportLogin,
  sendError,
  sendShowEmail,
  sendIntroAlert,
  sendEndingAlert,
  cencelAlerts,
  reportSlowlink,
  refreshSlowlinkData,
  forceRefreshUser,
  forceRefresh,
  fetchShowEmailCsv,
  moveAttendee,
  refreshEventbrite,
  sendAudioCue,
  createGuide,
  deleteGuide,
  setPartyGuide,
  sendCue,
  toggleNotifications,
  deleteHistoryEntry,
  deleteScene,
  getStreamKey,
  createPhase,
  updatePhase,
  deletePhase,
  swapPhases,
  setDefaultPhase,
  createPlace,
  deletePlace
};
module.exports = actions;
