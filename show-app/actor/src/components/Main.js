import React from 'react';
import config from 'config';
import { format } from 'date-fns';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Typography
} from '@material-ui/core';

import CloudDoneIcon from '@material-ui/icons/CloudDone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudOffIcon from '@material-ui/icons/CloudOff';

import HeadlessLayout from './HeadlessLayout';
import PerformanceScreen from './PerformanceScreen';
import MobileLayout from './MobileLayout';
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

    this.init = this.init.bind(this);
  }

  init() {
    const {
      actions,
      system,
      socketStatus
    } = this.props;
    const {
      login,
      contactShowService,
      getLocalFeed,
      getInputDevices
    } = actions;
    const {
      user,
      isAuthenticating,
      triedAuthentication,
      videoInputs,
      audioInputs,
      chosenAudioInput,
      chosenVideoInput,
      isGettingInputDevices,
      triedGettingInputDevices,
      isSwitchingInputs,
      mediaPermissions,
      isSettingMutes,
      audioConstraints
    } = system;
    const {
      connectionStatus,
      triedConnecting
    } = socketStatus;

    if (!user && !isAuthenticating && !triedAuthentication){
      login();
    }

    if(user && !triedConnecting && connectionStatus === socketStatusEnum.NOT_CONNECTED) {
      contactShowService();
    }

    if (!config.IS_HEADLESS && user && !isGettingInputDevices && !triedGettingInputDevices){
      getInputDevices();
    }

    if(!config.IS_HEADLESS && !isSwitchingInputs && (videoInputs.length && audioInputs.length) && !chosenAudioInput && !chosenVideoInput){
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
      
      getLocalFeed(audioInput, videoInput, audioConstraints);
    } else if (!config.IS_HEADLESS && !isSwitchingInputs && !isSettingMutes && user && ((user.isAudioMuted && chosenAudioInput !== 'NONE') || (user.isVideoMuted && chosenVideoInput !== 'NONE'))) {
      let audioInput = user.isAudioMuted ? 'NONE' : chosenAudioInput;
      let videoInput = user.isVideoMuted ? 'NONE' : chosenVideoInput;
      console.log('CORRECTING MUTES', user.isAudioMuted, user.isVideoMuted, chosenAudioInput, chosenVideoInput);
      getLocalFeed(audioInput, videoInput, audioConstraints);
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
      socketStatus,
      snackbar
    } = this.props;
    const {
      setReadyFlag
    } = actions;
    const {
      user,
      myCurrentPlace,
      previewedParty,
      currentParty,
      currentShow,
      localInputStream,
      localOutputStream,
      isGettingInputFeed,
      isNerdy
    } = system;
    let shouldShowReadyDialog = !!(!currentParty && myCurrentPlace && !myCurrentPlace.isAvailable);
    let shouldShowMobileScreen = ((config.CAN_CAPTURE_STREAM && localInputStream) || (!config.CAN_CAPTURE_STREAM && localOutputStream)) && config.IS_MOBILE && !isGettingInputFeed;
    let shouldShowPerformanceScreen = ((config.CAN_CAPTURE_STREAM && localInputStream) || (!config.CAN_CAPTURE_STREAM && localOutputStream)) && !config.IS_MOBILE && !isGettingInputFeed;

    let placeStuff = null;
    if(config.IS_HEADLESS){
      placeStuff = (
        <HeadlessLayout system={system} actions={actions} party={currentParty || previewedParty} />
      )
    } else if (!isGettingInputFeed) {
      placeStuff = (
        <>
          { shouldShowMobileScreen && <MobileLayout actions={actions} system={system} party={currentParty || previewedParty} /> }
          {shouldShowPerformanceScreen && <PerformanceScreen actions={actions} system={system} hasParty={!!currentParty} isPreviewing={!!previewedParty}/> }
        </>
      );
    }

    const connectionIconDict = {
      [socketStatusEnum.NOT_CONNECTED]: <CloudOffIcon />,
      [socketStatusEnum.CONNECTING]: <CloudUploadIcon />,
      [socketStatusEnum.CONNECTED]: <CloudDoneIcon />,
    };

    let statusColor = 'tomato';
    let statusText = '';
    if(socketStatus.connectionStatus === socketStatusEnum.CONNECTED) {
      if(currentShow) {
        statusText = `Show: ${format(new Date(currentShow.date), 'h:mm a')} -> ${currentShow.currentPhase.name}`;
        if(myCurrentPlace) {
          statusText += ` -> ${myCurrentPlace.characterName} @ ${myCurrentPlace.placeName}`;
          statusColor = 'limegreen';
        } else {
          statusText += ` -> NO ACTIVE CHARACTER`;
          statusColor = 'yellow';
        }
      } else {
        statusText = 'No shows active';
        statusColor = 'yellow';
      }
    } else {
      statusText = socketStatus.connectionStatus === socketStatusEnum.CONNECTING ? 'Connecting...' : 'Disconnected';
      statusColor = 'tomato';
    }

    return (
      <>
        <div className="actor-app">
          <div className="diagnostics-bar" style={{backgroundColor: statusColor}}>
            {connectionIconDict[socketStatus.connectionStatus]}
            <span>{statusText}</span>
          </div>
          <div ref="statsContainer" className={'stats-container' + (isNerdy ? ' show-stats' : ' hide-stats')}></div>
          { !!previewedParty && !config.IS_MOBILE && <div className="preview-banner">PREVIEW</div> }
          { placeStuff }
          <Dialog open={shouldShowReadyDialog}>
            <DialogTitle>You are marked as not ready</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Click READY when you have reset your space and are ready to accept a new ship.
                Until then no one can choose to visit you.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setReadyFlag(user._id, true)}>Ready</Button>
            </DialogActions>
          </Dialog>
          { shouldShowReadyDialog }

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
        </div>
      </>
    );
  }
}

Main.displayName = 'Main';
Main.propTypes = {};
Main.defaultProps = {};

export default Main;
