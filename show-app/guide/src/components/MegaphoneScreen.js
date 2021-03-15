import React from 'react';
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
import MegaphoneIcon from '@material-ui/icons/RssFeed';

import VideoFeed from './VideoFeed';
import Settings from './Settings';
import BackgroundAudio from './BackgroundAudio';

import './megaphonescreen.scss';

class MegaphoneScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSettingsDisplayed: false,
      isAudioDialOpen: false,
      isVideoDialOpen: false,
    };
  }

  render() {
    const {
      actions,
      system
    } = this.props;
    const {
      setLocalMutes,
      toggleMegaphone,
      getLocalStream
    } = actions;
    const {
      user,
      localFeed,
      currentShow: {
        currentPhase
      },
      videoInputs,
      audioInputs,
      chosenAudioInput,
      chosenVideoInput,
      isNerdy,
      audioSource,
      mixerContext,
      mixerOutput
    } = system;
    const {
      isAudioMuted,
      isVideoMuted
    } = user;
    const {
      isSettingsDisplayed,
      isAudioDialOpen,
      isVideoDialOpen
    } = this.state;
    
    const shouldPlayAudio = user.audioPath && user.audioPath.length;
    return (
      <div className="megaphonescreen-component">
        <Typography className="character-nametag">{user && user.characterName}</Typography>
        <div className="local-button-row">
          <div className="button-row-backdrop"></div>
          <IconButton className="settings-toggle" color="inherit" onClick={() =>  this.setState({isSettingsDisplayed: true}) }>
            <SettingsIcon fontSize="small" style={{ color: 'black' }} />
          </IconButton>
          <IconButton className="megaphone-toggle" color="inherit" onClick={() => toggleMegaphone(user._id, !user.isMegaphone) }>
            { user.isMegaphone ? <MegaphoneIcon fontSize="small" color="primary" /> : <MegaphoneIcon fontSize="small" style={{ color: 'black' }} /> }
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
        { localFeed && 
          <VideoFeed
            actions={actions}
            feed={localFeed}
            isLocal={true}
            hasOverlay={false}
            overlayDelay={-0.1}
            isLocalVideoMuted={isVideoMuted}
            isLocalAudioMuted={isAudioMuted}
            isNerdy={isNerdy}
            />
        }
        { isSettingsDisplayed && <Settings system={system} actions={actions} onClose={()=>this.setState({isSettingsDisplayed: false})} /> }
        { shouldPlayAudio && mixerContext && <BackgroundAudio audioPath={user.audioPath} mixerContext={mixerContext} audioSource={audioSource} audioVolume={0.5} mixerOutput={mixerOutput} /> }
      </div>
    );
  }
}

MegaphoneScreen.displayName = 'MegaphoneScreen';
MegaphoneScreen.propTypes = {};
MegaphoneScreen.defaultProps = {};

export default MegaphoneScreen;
