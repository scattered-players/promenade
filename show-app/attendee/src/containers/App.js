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
  receiveCue,
  toggleVisualCues
} from '../actions/';
import Main from '../components/App';
/* Populated by react-webpack-redux:reducer */
class App extends Component {
  render() {
    const {actions, stuff, system, socketStatus, snackbar, janus} = this.props;
    return (
      <Main
        actions={actions}
        stuff={stuff}
        system={system}
        socketStatus={socketStatus}
        snackbar={snackbar}
        janus={janus}/>
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
    receiveShowStatus: PropTypes.func.isRequired,
    receiveBookedShows: PropTypes.func.isRequired,
    receiveCurrentShowState: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    loginSuccess: PropTypes.func.isRequired,
    loginFailure: PropTypes.func.isRequired,
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
    changeVideoRoomParticipants: PropTypes.func.isRequired,
    receiveRemoteFeed: PropTypes.func.isRequired,
    removeRemoteFeed: PropTypes.func.isRequired,
    attachRemoteFeed: PropTypes.func.isRequired,
    detachRemoteFeed: PropTypes.func.isRequired,
    attachLocalFeed: PropTypes.func.isRequired,
    receiveAudioBridgeFeed: PropTypes.func.isRequired,
    setLocalMutes: PropTypes.func.isRequired,
    appendChatMessage: PropTypes.func.isRequired,
    sendChatMessage: PropTypes.func.isRequired,
    selectPlace: PropTypes.func.isRequired,
    selectPlaceSuccess: PropTypes.func.isRequired,
    selectPlaceFailure: PropTypes.func.isRequired,
    receiveActorFeed: PropTypes.func.isRequired,
    removeActorFeed: PropTypes.func.isRequired,
    queueAtPlace: PropTypes.func.isRequired,
    queueAtPlaceSuccess: PropTypes.func.isRequired,
    queueAtPlaceFailure: PropTypes.func.isRequired,
    wereBlocked: PropTypes.func.isRequired,
    joinStream: PropTypes.func.isRequired,
    leaveStream: PropTypes.func.isRequired,
    streamFailure: PropTypes.func.isRequired,
    setStreamingStream: PropTypes.func.isRequired,
    getLocalStream: PropTypes.func.isRequired,
    getLocalStreamSuccess: PropTypes.func.isRequired,
    getLocalStreamFailure: PropTypes.func.isRequired,
    changeUsername: PropTypes.func.isRequired,
    getInputDevices: PropTypes.func.isRequired,
    getInputDevicesSuccess: PropTypes.func.isRequired,
    getInputDevicesFailure: PropTypes.func.isRequired,
    joinEchoTest: PropTypes.func.isRequired,
    joinEchoTestSuccess: PropTypes.func.isRequired,
    joinEchoTestFailure: PropTypes.func.isRequired,
    leaveEchoTest: PropTypes.func.isRequired,
    receiveEchoStream: PropTypes.func.isRequired,
    toggleMediaConsent: PropTypes.func.isRequired,
    toggleNerdiness: PropTypes.func.isRequired,
    reportError: PropTypes.func.isRequired,
    toggleNavMusic: PropTypes.func.isRequired,
    reportSlowlink: PropTypes.func.isRequired,
    forceRefresh: PropTypes.func.isRequired,
    janusSessionCreated: PropTypes.func.isRequired,
    receiveAudioCue: PropTypes.func.isRequired,
    writeNotes: PropTypes.func.isRequired,
    receiveCue: PropTypes.func.isRequired,
    toggleVisualCues: PropTypes.func.isRequired
  }),
  stuff: PropTypes.shape({}),
  system: PropTypes.shape({}),
  socketStatus: PropTypes.shape({}),
  snackbar: PropTypes.shape({}),
  janus: PropTypes.shape({})
};
function mapStateToProps(state) {
  // eslint-disable-line no-unused-vars
  /* Populated by react-webpack-redux:reducer */
  const props = {
    stuff: state.stuff,
    system: state.system,
    socketStatus: state.socketStatus,
    snackbar: state.snackbar,
    janus: state.janus
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
    receiveCue,
    toggleVisualCues
  };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
