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
  adjustVolume,
  toggleMonitor,
  setReadyFlag,
  toggleMediaConsent,
  reportSlowlink,
  forceRefresh,
  receiveCue,
  setLiteFilter
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
    contactShowServiceSuccess: PropTypes.func.isRequired,
    lostContactWithShowService: PropTypes.func.isRequired,
    showSnackbar: PropTypes.func.isRequired,
    dismissSnackbar: PropTypes.func.isRequired,
    receiveCurrentShowState: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    loginFailure: PropTypes.func.isRequired,
    loginSuccess: PropTypes.func.isRequired,
    acceptParty: PropTypes.func.isRequired,
    acceptPartySuccess: PropTypes.func.isRequired,
    acceptPartyFailure: PropTypes.func.isRequired,
    kickParty: PropTypes.func.isRequired,
    kickPartySuccess: PropTypes.func.isRequired,
    kickPartyFailure: PropTypes.func.isRequired,
    joinAudioBridge: PropTypes.func.isRequired,
    joinAudioBridgeSuccess: PropTypes.func.isRequired,
    joinAudioBridgeFailure: PropTypes.func.isRequired,
    leaveAudioBridge: PropTypes.func.isRequired,
    leaveAudioBridgeSuccess: PropTypes.func.isRequired,
    leaveAudioBridgeFailure: PropTypes.func.isRequired,
    joinVideoRoom: PropTypes.func.isRequired,
    joinVideoRoomSuccess: PropTypes.func.isRequired,
    joinVideoRoomFailure: PropTypes.func.isRequired,
    leaveVideoRoom: PropTypes.func.isRequired,
    leaveVideoRoomSuccess: PropTypes.func.isRequired,
    leaveVideoRoomFailure: PropTypes.func.isRequired,
    receiveRemoteFeed: PropTypes.func.isRequired,
    attachRemoteFeed: PropTypes.func.isRequired,
    detachRemoteFeed: PropTypes.func.isRequired,
    attachLocalFeed: PropTypes.func.isRequired,
    receiveAudioBridgeFeed: PropTypes.func.isRequired,
    setLocalMutes: PropTypes.func.isRequired,
    appendChatMessage: PropTypes.func.isRequired,
    sendChatMessage: PropTypes.func.isRequired,
    setLocalStream: PropTypes.func.isRequired,
    setFilterName: PropTypes.func.isRequired,
    getLocalFeed: PropTypes.func.isRequired,
    getLocalFeedSuccess: PropTypes.func.isRequired,
    getLocalFeedFailure: PropTypes.func.isRequired,
    giveItem: PropTypes.func.isRequired,
    blockUser: PropTypes.func.isRequired,
    setRemoteMutes: PropTypes.func.isRequired,
    changeUsername: PropTypes.func.isRequired,
    changePlace: PropTypes.func.isRequired,
    getInputDevices: PropTypes.func.isRequired,
    getInputDevicesSuccess: PropTypes.func.isRequired,
    getInputDevicesFailure: PropTypes.func.isRequired,
    toggleNerdiness: PropTypes.func.isRequired,
    takeItem: PropTypes.func.isRequired,
    toggleNotifications: PropTypes.func.isRequired,
    previewParty: PropTypes.func.isRequired,
    reportError: PropTypes.func.isRequired,
    adjustVolume: PropTypes.func.isRequired,
    toggleMonitor: PropTypes.func.isRequired,
    setReadyFlag: PropTypes.func.isRequired,
    toggleMediaConsent: PropTypes.func.isRequired,
    reportSlowlink: PropTypes.func.isRequired,
    forceRefresh: PropTypes.func.isRequired,
    receiveCue: PropTypes.func.isRequired,
    setLiteFilter: PropTypes.func.isRequired
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
    adjustVolume,
    toggleMonitor,
    setReadyFlag,
    toggleMediaConsent,
    reportSlowlink,
    forceRefresh,
    receiveCue,
    setLiteFilter
  };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
