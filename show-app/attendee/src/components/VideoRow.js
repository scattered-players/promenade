import React from 'react';
import config from 'config';

import {
  Badge,
  IconButton,
  Tooltip,
  Typography
} from '@material-ui/core';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import SettingsIcon from '@material-ui/icons/Settings';

import phaseKindsEnum from '../enum/phasesKinds';

import VideoFeed from './VideoFeed';
import Settings from './Settings';

import './videorow.scss';

class VideoRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage:'',
      isSettingsDisplayed: false,
      isAudioDialOpen: false,
      isVideoDialOpen: false,
    };
  }

  componentDidMount() {
    const {
      actions: {
        joinVideoRoom
      },
      system: {
        user,
        myParty,
        localStream,
        janusCoefficient
      }
    } = this.props;
    const {
      isAudioMuted,
      isVideoMuted
    } = user;
    const janusSubdomain = 'janus' + Math.floor(myParty.janusIndex * janusCoefficient);
    joinVideoRoom(`wss://${janusSubdomain}.${config.JANUS_DOMAIN}:8989/`, myParty._id, user._id, isAudioMuted, isVideoMuted, localStream);
  }

  componentWillUnmount() {
    const { actions: { leaveVideoRoom } } = this.props;
    leaveVideoRoom();
  }

  render() {
    const {
      actions,
      system
    } = this.props;
    const {
      setLocalMutes,
      getLocalStream
    } = actions;
    const {
      myParty,
      user,
      localFeed,
      currentShow: {
        hasEndingAlert,
        currentPhase
      },
      videoInputs,
      audioInputs,
      chosenAudioInput,
      chosenVideoInput,
      mediaPermissions,
      isNerdy
    } = system;
    const {
      isAudioMuted,
      isVideoMuted
    } = user;
    const { decider } = myParty;
    const {
      newMessage,
      isSettingsDisplayed,
      isAudioDialOpen,
      isVideoDialOpen
    } = this.state;
    return (
      <div className="video-row">
        {
          user && myParty && myParty.guide && myParty.guide.isOnline && (
            <div className="video-feed-wrapper">
              <div className="nametag-wrapper-wrapper">
                <div className="nametag-wrapper">
                  <Typography variant="body1" className="nametag">{'GUIDE ' + myParty.guide.characterName}</Typography>
                </div>
              </div>
              { 
                myParty.guide.feed && (
                  <VideoFeed
                    actions={actions}
                    isDecider={ false }
                    feed={myParty.guide.feed}
                    isLocal={false}
                    hasOverlay={true}
                    overlayDelay={0}
                    isLocalVideoMuted={false}
                    isLocalAudioMuted={false}
                    isNerdy={isNerdy}
                    shouldMute={currentPhase.kind === phaseKindsEnum.STATIC_VIDEO || currentPhase.kind === phaseKindsEnum.VIDEO_CHOICE}
                  /> 
                )
              }
            </div>
          )
        }
        { 
          user &&
            <div className="video-feed-wrapper local-feed-wrapper">
              <div className="nametag-wrapper-wrapper">
                <div className="nametag-wrapper">
                  <Typography variant="body1" className="nametag">{user.username}</Typography>
                </div>
              </div>
              { !(currentPhase.kind === phaseKindsEnum.STATIC_VIDEO || currentPhase.kind === phaseKindsEnum.VIDEO_CHOICE) &&
                <div className="local-button-row">
                  <div className="button-row-backdrop"></div>
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
              }
              { localFeed && 
                <VideoFeed
                  actions={actions}
                  isDecider={ decider && decider.attendee._id === user._id }
                  feed={localFeed}
                  isLocal={true}
                  hasOverlay={true}
                  overlayDelay={-0.1}
                  isLocalVideoMuted={isVideoMuted}
                  isLocalAudioMuted={isAudioMuted}
                  isNerdy={isNerdy}
                  shouldMute={currentPhase.kind === phaseKindsEnum.STATIC_VIDEO || currentPhase.kind === phaseKindsEnum.VIDEO_CHOICE}
                  />
              }
            </div>
        }
        {
          user && myParty && myParty.attendees
            .filter(attendee => attendee._id !== user._id && attendee.isOnline && !attendee.isBlocked)
            .map((attendee, i) => (
            <div className="video-feed-wrapper" key={attendee._id}>
              <div className="nametag-wrapper-wrapper">
                <div className="nametag-wrapper">
                  <Typography variant="body1" className="nametag">{attendee.username}</Typography>
                </div>
              </div>
              { 
                attendee.feed && (
                  <VideoFeed
                    actions={actions}
                    isDecider={ decider && decider.attendee._id === attendee._id }
                    feed={attendee.feed}
                    isLocal={false}
                    hasOverlay={true}
                    overlayDelay={i/10}
                    isLocalVideoMuted={false}
                    isLocalAudioMuted={false}
                    isNerdy={isNerdy}
                    shouldMute={currentPhase.kind === phaseKindsEnum.STATIC_VIDEO || currentPhase.kind === phaseKindsEnum.VIDEO_CHOICE}
                  /> 
                )
              }
            </div>
          ))
        }
        { isSettingsDisplayed && <Settings system={system} actions={actions} onClose={()=>this.setState({isSettingsDisplayed: false})} /> }
      </div>
    );
  }
}

VideoRow.displayName = 'VideoRow';
VideoRow.propTypes = {};
VideoRow.defaultProps = {};

export default VideoRow;
