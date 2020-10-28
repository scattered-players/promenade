import React from 'react';
import config from 'config';

import {
  IconButton,
  Typography
} from '@material-ui/core';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import SettingsIcon from '@material-ui/icons/Settings';

import VolumeMeter from './VolumeMeter';
import Settings from './Settings';
import VideoFeed from './VideoFeed';

import './haircheck.scss';

class HairCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSettingsDisplayed: false,
      isAudioDialOpen: false,
      isVideoDialOpen: false,
    };
  }
  componentDidMount() {
    const {
      actions: {
        joinEchoTest
      },
      system: {
        user,
        localStream
      }
    } = this.props;
    const {
      isAudioMuted,
      isVideoMuted
    } = user;
    joinEchoTest(`wss://janus.${config.JANUS_DOMAIN}:8989/`, user._id, isAudioMuted, isVideoMuted, localStream);
  }

  componentWillUnmount(){
    const { actions: { leaveEchoTest } } = this.props;
    leaveEchoTest();
  }

  render() {
    const {
      actions,
      system
    } = this.props,
    {
      getLocalStream
    } = actions,
    {
      localStream,
      echoRemoteStream,
      videoInputs,
      audioInputs,
      chosenAudioInput,
      chosenVideoInput,
      user
    } = system,
    {
      username,
      isAudioMuted,
      isVideoMuted
    } = user,
    {
      isSettingsDisplayed,
      isVideoDialOpen,
      isAudioDialOpen
    } = this.state;
    return (
      <>
        <Typography variant="body1">
          This is the webcam and microphone you'll be using to participate in the show.
        </Typography>
        <Typography variant="body1">
          If you want your camera and/or microphone to be off when the show starts, you can turn them off here.
          (You can turn them on/off at any point in the show)
        </Typography>
        <div className="video-feed-wrapper local-feed-wrapper echotest-feed-wrapper">
          <div className="nametag-wrapper-wrapper">
            <div className="nametag-wrapper">
              <Typography variant="body1" className="nametag">{user.username}</Typography>
            </div>
          </div>
          <div className="local-button-row">
            <div className="steel"></div>
            <IconButton className="settings-toggle" color="inherit" onClick={() =>  this.setState({isSettingsDisplayed: true}) }>
              <SettingsIcon fontSize="small" style={{ color: 'black' }} />
            </IconButton>
            <div className="dial-wrapper-wrapper">
              <div className="dial-wrapper">
                <SpeedDial
                  ariaLabel="Audio Input Selector"
                  icon={isAudioMuted ? <MicOffIcon fontSize="small" color="secondary"/> : <MicIcon fontSize="small" color="primary" />}
                  onClose={() => this.setState({ isAudioDialOpen: false})}
                  onOpen={() => this.setState({ isAudioDialOpen: true})}
                  open={isAudioDialOpen}
                >
                {audioInputs.map(input => (
                  <SpeedDialAction
                    className={input.deviceId === chosenAudioInput ? 'selected-device': ''}
                    key={`${input.deviceId}+${input.groupId}+${input.label}`}
                    icon={input.deviceId === 'NONE' ? <MicOffIcon fontSize="small" color="secondary"/> : <MicIcon fontSize="small" color="primary" />}
                    tooltipTitle={input.label}
                    tooltipOpen
                    tooltipPlacement="right"
                    classes={{staticTooltipLabel: input.deviceId === chosenAudioInput && 'selected-device'}}
                    onClick={e => getLocalStream(input.deviceId, chosenVideoInput)}
                  />
                ))}
                </SpeedDial>
              </div>
            </div>
            <div className="dial-wrapper-wrapper">
              <div className="dial-wrapper">
                <SpeedDial
                  ariaLabel="Video Input Selector"
                  icon={isVideoMuted ? <VideocamOffIcon fontSize="small" color="secondary"/> : <VideocamIcon fontSize="small" color="primary" />}
                  onClose={() => this.setState({ isVideoDialOpen: false })}
                  onOpen={() => this.setState({ isVideoDialOpen: true })}
                  open={isVideoDialOpen}
                >
                {
                  videoInputs.map(input => (
                    <SpeedDialAction
                      className={input.deviceId === chosenVideoInput ? 'selected-device': ''}
                      key={`${input.deviceId}+${input.groupId}+${input.label}`}
                      icon={input.deviceId === 'NONE' ? <VideocamOffIcon fontSize="small" color="secondary"/> : <VideocamIcon fontSize="small" color="primary" />}
                      tooltipTitle={input.label}
                      tooltipOpen
                      tooltipPlacement="right"
                      classes={{staticTooltipLabel: input.deviceId === chosenVideoInput && 'selected-device'}}
                      onClick={e => getLocalStream(chosenAudioInput, input.deviceId)}
                    />
                  ))
                }
                </SpeedDial>
              </div>
            </div>
          </div>
          <VideoFeed actions={actions} isDecider={ false } feed={{ stream: echoRemoteStream }} isLocal={true} hasOverlay={true} overlayDelay={-0.1}/>
          { !isAudioMuted && localStream.getAudioTracks().length && <VolumeMeter stream={localStream} /> }
        </div>
        <Typography variant="body1">
          Note: Your camera and microphone will only be used during the interactive parts of the show.
          If you can't see this camera feed on the screen, it means no one else can see you either.
        </Typography>
        { isSettingsDisplayed && <Settings system={system} actions={actions} onClose={()=>this.setState({isSettingsDisplayed: false})} /> }
      </>
    );
  }
}

HairCheck.displayName = 'HairCheck';
HairCheck.propTypes = {};
HairCheck.defaultProps = {};

export default HairCheck;
