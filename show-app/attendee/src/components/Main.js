import React from 'react';
import config from 'config';

import {
  SHOW_TITLE
} from 'custom/config.json';

import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Snackbar,
  Typography
} from '@material-ui/core';

import BookedShowScreen from './BookedShowScreen';
import BlockedScreen from './BlockedScreen';
import LiveShowScreen from './LiveShowScreen';
import socketStatusEnum from '../enum/socketStatus';
import {
  mainFps,
  ramStats,
  workerFps
} from '../util/stats';

import './main.scss';

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      hasInteracted: true
    };

    this.init = this.init.bind(this);
  }

  init() {
    const {
      actions,
      system,
      socketStatus
    } = this.props,
    {
      login,
      contactShowService,
      getInputDevices,
      getLocalStream,
      setLocalMutes
    } = actions,
    {
      user,
      isAuthenticating,
      triedAuthentication,
      videoInputs,
      audioInputs,
      chosenAudioInput,
      chosenVideoInput,
      isGettingMediaDevices,
      hasGottenMediaDevices,
      isSwitchingInputs,
      mediaPermissions,
      isSettingMutes
    } = system,
    {
      connectionStatus,
      triedConnecting
    } = socketStatus;

    if (!user && !isAuthenticating && !triedAuthentication){
      login();
    }

    if (user && !triedConnecting && connectionStatus === socketStatusEnum.NOT_CONNECTED) {
      contactShowService();
    }

    if (user && !isGettingMediaDevices && !hasGottenMediaDevices){
      getInputDevices();
    }

    console.log('HUH?',isSwitchingInputs, isSettingMutes, JSON.stringify(user),  (user && user.isAudioMuted && chosenAudioInput !== 'NONE'),  (user && user.isVideoMuted && chosenVideoInput !== 'NONE'), videoInputs, audioInputs, chosenAudioInput, chosenVideoInput);
    if (!isSwitchingInputs && (videoInputs.length && audioInputs.length) && chosenAudioInput === undefined && chosenVideoInput === undefined) {
      let audioInput = localStorage.getItem('chosenAudioInput');
      let videoInput = localStorage.getItem('chosenVideoInput');

      if (!audioInput || !audioInputs.reduce((acc, device) => acc || device.deviceId === audioInput, false)) {
        if (mediaPermissions.audio && audioInputs.length > 0) {
          audioInput = audioInputs[1].deviceId;
        } else {
          audioInput = audioInputs[0].deviceId;
        }
      }

      if (!videoInput || !videoInputs.reduce((acc, device) => acc || device.deviceId === videoInput, false)) {
        if (mediaPermissions.video && videoInputs.length > 0) {
          videoInput = videoInputs[1].deviceId;
        } else {
          videoInput = videoInputs[0].deviceId;
        }
      }
      
      console.log('CHOSEN DEVICES', videoInput.length, audioInput.length);
      // if (audioInput && videoInput){
        getLocalStream(audioInput, videoInput);
      // }
    } else if (!isSwitchingInputs && !isSettingMutes && user && ((user.isAudioMuted && chosenAudioInput !== 'NONE') || (user.isVideoMuted && chosenVideoInput !== 'NONE'))) {
      let audioInput = user.isAudioMuted ? 'NONE' : chosenAudioInput || localStorage.getItem('chosenAudioInput');
      let videoInput = user.isVideoMuted ? 'NONE' : chosenVideoInput || localStorage.getItem('chosenVideoInput');
      console.log('CORRECTING MUTES', user.isAudioMuted, user.isVideoMuted, chosenAudioInput, chosenVideoInput);
      getLocalStream(audioInput, videoInput);
    }
  }

  componentDidMount() {
    const {
      statsContainer
    } = this.refs;
    statsContainer.appendChild(mainFps.dom);
    statsContainer.appendChild(ramStats.dom);
    statsContainer.appendChild(workerFps.dom);
    this.init();
  }

  componentDidUpdate() {
    this.init();
  }

  render() {
    const {
      actions,
      system,
      snackbar
    } = this.props;
    const {
      bookedShows,
      places,
      isInCurrentShow,
      isBlocked,
      askingMediaConsent,
      isSwitchingInputs,
      isNerdy,
      isGettingMediaDevices
    } = system;
    const { hasInteracted } = this.state;
    console.log('SYSTEM', system);
    return (
      <React.Fragment>
        <div ref="statsContainer" className={'stats-container' + (isNerdy ? ' show-stats' : ' hide-stats')}></div>
        {
          isBlocked
          ? <BlockedScreen />
          : hasInteracted && places && !askingMediaConsent && !isSwitchingInputs && !isGettingMediaDevices && ((isInCurrentShow)
            ? <LiveShowScreen actions={actions} system={system} />
            : <BookedShowScreen bookedShows={bookedShows} actions={actions} system={system} />)
        }
        <Dialog onClose={() => this.setState({hasInteracted: true})} open={!hasInteracted && !isBlocked && !askingMediaConsent}>
          <DialogContent>
            { `Welcome to ${SHOW_TITLE}!` }
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({hasInteracted: true})}>
              Continue
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={askingMediaConsent && !isBlocked}>
          <DialogContent>
            <Typography variant="body1">
              Please click "Allow" if you want to use your camera and/or microphone at any point in the show.
              You will be able to mute your microphone and stop your camera feed at any time.
            </Typography>
          </DialogContent>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={snackbar.open}
          autoHideDuration={snackbar.timeout}
          onClose={actions.dismissSnackbar}
          message={<span id="message-id">{snackbar.text}</span>}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
        />
      </React.Fragment>
    );
  }
}

Main.displayName = 'Main';
Main.propTypes = {};
Main.defaultProps = {};

export default Main;
