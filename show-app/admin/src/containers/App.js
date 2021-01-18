/* CAUTION: When using the generators, this file is modified in some places.
 *          This is done via AST traversal - Some of your formatting may be lost
 *          in the process - no functionality should be broken though.
 *          This modifications only run once when the generator is invoked - if
 *          you edit them, they are not updated again.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
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
  deletePhase
} from '../actions/';
import Main from '../components/App';
/* Populated by react-webpack-redux:reducer */
class App extends Component {
  render() {
    const {actions, stuff, system, socketStatus, snackbar} = this.props;
    return (
      <Main
        actions={actions}
        stuff={stuff}
        system={system}
        socketStatus={socketStatus}
        snackbar={snackbar}/>
    );
  }
}
/* Populated by react-webpack-redux:reducer
 *
 * HINT: if you adjust the initial type of your reducer, you will also have to
 *       adjust it here.
 */
App.propTypes = {
  actions: PropTypes.shape({
    contactShowService: PropTypes.func.isRequired,
    receiveSystemState: PropTypes.func.isRequired,
    contactShowServiceSuccess: PropTypes.func.isRequired,
    lostContactWithShowService: PropTypes.func.isRequired,
    scheduleShow: PropTypes.func.isRequired,
    scheduleShowSuccess: PropTypes.func.isRequired,
    scheduleShowFailure: PropTypes.func.isRequired,
    showSnackbar: PropTypes.func.isRequired,
    dismissSnackbar: PropTypes.func.isRequired,
    changeShowStatus: PropTypes.func.isRequired,
    changeShowStatusSuccess: PropTypes.func.isRequired,
    changeShowStatusFailure: PropTypes.func.isRequired,
    changeShowRunning: PropTypes.func.isRequired,
    changeShowRunningSuccess: PropTypes.func.isRequired,
    changeShowRunningFailure: PropTypes.func.isRequired,
    bookTicket: PropTypes.func.isRequired,
    bookTicketSuccess: PropTypes.func.isRequired,
    bookTicketFailure: PropTypes.func.isRequired,
    receiveCurrentShowState: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    loginSuccess: PropTypes.func.isRequired,
    loginFailure: PropTypes.func.isRequired,
    createActor: PropTypes.func.isRequired,
    createActorSuccess: PropTypes.func.isRequired,
    createActorFailure: PropTypes.func.isRequired,
    createAdmin: PropTypes.func.isRequired,
    createAdminSuccess: PropTypes.func.isRequired,
    createAdminFailure: PropTypes.func.isRequired,
    getMagicLink: PropTypes.func.isRequired,
    getMagicLinkSuccess: PropTypes.func.isRequired,
    getMagicLinkFailure: PropTypes.func.isRequired,
    kickParty: PropTypes.func.isRequired,
    kickPartySuccess: PropTypes.func.isRequired,
    kickPartyFailure: PropTypes.func.isRequired,
    deleteShow: PropTypes.func.isRequired,
    updateShowInfo: PropTypes.func.isRequired,
    deleteActor: PropTypes.func.isRequired,
    deleteAdmin: PropTypes.func.isRequired,
    reportError: PropTypes.func.isRequired,
    reportLogin: PropTypes.func.isRequired,
    sendError: PropTypes.func.isRequired,
    sendShowEmail: PropTypes.func.isRequired,
    sendIntroAlert: PropTypes.func.isRequired,
    sendEndingAlert: PropTypes.func.isRequired,
    cencelAlerts: PropTypes.func.isRequired,
    reportSlowlink: PropTypes.func.isRequired,
    refreshSlowlinkData: PropTypes.func.isRequired,
    forceRefreshUser: PropTypes.func.isRequired,
    forceRefresh: PropTypes.func.isRequired,
    fetchShowEmailCsv: PropTypes.func.isRequired,
    moveAttendee: PropTypes.func.isRequired,
    refreshEventbrite: PropTypes.func.isRequired,
    sendAudioCue: PropTypes.func.isRequired,
    createGuide: PropTypes.func.isRequired,
    deleteGuide: PropTypes.func.isRequired,
    setPartyGuide: PropTypes.func.isRequired,
    sendCue: PropTypes.func.isRequired,
    toggleNotifications: PropTypes.func.isRequired,
    deleteHistoryEntry: PropTypes.func.isRequired,
    deleteScene: PropTypes.func.isRequired,
    getStreamKey: PropTypes.func.isRequired,
    createPhase: PropTypes.func.isRequired,
    updatePhase: PropTypes.func.isRequired,
    deletePhase: PropTypes.func.isRequired
  }),
  stuff: PropTypes.shape({}),
  system: PropTypes.shape({}),
  socketStatus: PropTypes.shape({}),
  snackbar: PropTypes.shape({})
};
function mapStateToProps(state) {
  // eslint-disable-line no-unused-vars
  /* Populated by react-webpack-redux:reducer */
  const props = {
    stuff: state.stuff,
    system: state.system,
    socketStatus: state.socketStatus,
    snackbar: state.snackbar
  };
  return props;
}
function mapDispatchToProps(dispatch) {
  /* Populated by react-webpack-redux:action */
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
    deletePhase
  };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
