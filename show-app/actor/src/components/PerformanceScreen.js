import React from 'react';
import config from 'config';

import {
  Button,
  IconButton,
} from '@material-ui/core';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';

import BackgroundAudio from './BackgroundAudio';
import LocalFeed from './LocalFeed';
import VideoRow from './VideoRow';
import LeftSidebar from './LeftSidebar';
import PartySidebar from './PartySidebar';
import Settings from './Settings';
import CharacterInfo from './CharacterInfo';
import VolumeMeter from './VolumeMeter';
import FILTERS from 'custom/filters';

const FILTER_NAMES = Object.keys(FILTERS);

import './performancescreen.scss';

class PerformanceScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime: 0,
      elapsedTime: 0,
      isSettingsDisplayed: false,
      isCharacterInfoDisplayed: false,
      isAudioDialOpen: false,
      isVideoDialOpen: false,
    }

    this.sourceCanvas = React.createRef();

    this.renderFrame = this.renderFrame.bind(this);
  }

  componentDidMount() {
    if(config.CAN_CAPTURE_STREAM){
      const {
        actions: {
          setLocalStream
        },
        system: {
          mixerOutputStream
        }
      } = this.props;
      let { targetCanvas } = this.refs;
      this.ctx = targetCanvas.getContext('2d');
      let canvasStream = targetCanvas.captureStream()
      setLocalStream(new MediaStream([...mixerOutputStream.getAudioTracks(), ...canvasStream.getVideoTracks()]));
      this.renderFrame();
    } else {
      const {
        system: {
          localOutputStream
        }
      } = this.props;
      let { localStreamVideo } = this.refs;
      localStreamVideo.srcObject = localOutputStream;
    }
    const {
      system: {
        currentParty
      }
    } = this.props;
    if(currentParty){
      console.log('HEYO TIMER')
      this.setState({
        startTime: Date.now(),
        elapsedTime: 0
      })
      this.timer = setInterval(() => {
        console.log('TIMER')
        this.setState({
          elapsedTime: (Date.now() - this.state.startTime)
        })
      }, 500);
    }
  }

  componentDidUpdate(prevProps){
    if(!prevProps.system.currentParty && this.props.system.currentParty){
      this.setState({
        startTime:Date.now(),
        elapsedTime: 0
      })
      this.timer = setInterval(() => {
        console.log('TIMER')
        this.setState({
          elapsedTime: (Date.now() - this.state.startTime)
        })
      }, 500);
    } else if(prevProps.system.currentParty && !this.props.system.currentParty){
      this.setState({
        startTime:0,
        elapsedTime: 0
      })
      this.timer && clearInterval(this.timer);
    }
  }

  renderFrame() {
    let {
      ctx,
      sourceCanvas
    } = this;
    let { targetCanvas } = this.refs;

    if(sourceCanvas && sourceCanvas.current){
      targetCanvas.width = sourceCanvas.current.width;
      targetCanvas.height = sourceCanvas.current.height;
      ctx.drawImage(sourceCanvas.current, 0, 0);
    } else {
      console.log('NO CANVAS');
    }
    this.rAF = requestAnimationFrame(this.renderFrame);
  }

  componentWillUnmount() {
    this.sourceCanvas = null;
    this.ctx = null;
    if(this.rAF){
      cancelAnimationFrame(this.rAF);
    }
    this.timer && clearInterval(this.timer);
  }

  render() {
    const {
      actions,
      system,
      hasParty,
      isPreviewing
    } = this.props,
    {
      acceptParty,
      getLocalFeed
    } = actions,
    {
      previewedParty,
      currentParty,
      myPlace,
      user,
      audioInputs,
      videoInputs,
      audioSource,
      localOutputStream,
      activeFilter,
      mixerContext,
      mixerOutput,
      isMonitorOn,
      chosenAudioInput,
      chosenVideoInput,
      audioConstraints
    } = system,
    {
      isAudioMuted,
      isVideoMuted
    } = user,
    {
      elapsedTime,
      isSettingsDisplayed,
      isCharacterInfoDisplayed,
      isAudioDialOpen,
      isVideoDialOpen
    } = this.state;
    const shouldPlayAudio = !!currentParty && myPlace.audioPath && myPlace.audioPath.length;
    const elapsedMinutes = Math.floor(Math.round(elapsedTime/1000)/60);
    const elapsedSeconds = Math.round(elapsedTime/1000) % 60;
    return (
      <div className="performancescreen-component">
        <div className="upper-region">
          { !config.IS_MOBILE && <LeftSidebar system={system} actions={actions}/> }
          <div className="main-area">
            {
              elapsedTime > 0 &&
              <div className="elapsed-time">
                {elapsedMinutes > 0 && `${elapsedMinutes} min `}
                { `${elapsedSeconds} sec` }
              </div>
            }
            { 
              user && 
                <div className="local-feed-wrapper">
                  <div className="local-button-row">
                    <div className="button-row-backdrop"></div>
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
                            onClick={e => getLocalFeed(input.deviceId, chosenVideoInput, audioConstraints)}
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
                              onClick={e => getLocalFeed(chosenAudioInput, input.deviceId, audioConstraints)}
                            />
                          ))
                        }
                        </SpeedDial>
                      </div>
                    </div>
                    <IconButton className="settings-toggle" color="inherit" onClick={() =>  this.setState({isCharacterInfoDisplayed: true}) }>
                      <InfoIcon fontSize="small" style={{ color: 'black' }} />
                    </IconButton>
                    <IconButton className="settings-toggle" color="inherit" onClick={() =>  this.setState({isSettingsDisplayed: true}) }>
                      <SettingsIcon fontSize="small" style={{ color: 'black' }} />
                    </IconButton>
                  </div>
                  {
                    isPreviewing && (
                      <div className="preview-alert">
                        <div className="preview-message">You are currently previewing {previewedParty.name}</div>
                        <div className="preview-action">
                          <Button onClick={() => acceptParty(previewedParty._id, myPlace._id)}>Accept Party</Button>
                        </div>
                      </div>
                    )
                  }
                  {
                    config.CAN_CAPTURE_STREAM
                    ? <canvas className={ "local-stream" + ((activeFilter === 'aiScene') ? ' ai-canvas' : '') } ref="targetCanvas"></canvas>
                    : <video className="local-stream" ref="localStreamVideo" muted={!isMonitorOn} autoPlay playsInline></video>
                  }
                  {
                    config.CAN_CAPTURE_STREAM && localOutputStream && FILTER_NAMES
                      .filter(name => name === activeFilter)
                      .map(name => <LocalFeed key={name} sourceCanvas={this.sourceCanvas} filter={FILTERS[name]} system={system} actions={actions} />)
                  }
                  { mixerContext && audioSource && <VolumeMeter mixerContext={mixerContext} audioSource={audioSource} /> }
                </div>
            }
          </div>
          {
            (hasParty || isPreviewing) && localOutputStream && <PartySidebar actions={actions} system={system} party={currentParty || previewedParty} />
          }
        </div>
        { hasParty && localOutputStream && <VideoRow actions={actions} system={system} />}
        { shouldPlayAudio && <BackgroundAudio audioPath={myPlace.audioPath} mixerContext={mixerContext} mixerOutput={mixerOutput} audioVolume={myPlace.audioVolume} /> }
        { isSettingsDisplayed && <Settings system={system} actions={actions} onClose={()=>this.setState({isSettingsDisplayed: false})} /> }
        { isCharacterInfoDisplayed && <CharacterInfo system={system} actions={actions} onClose={()=>this.setState({isCharacterInfoDisplayed: false})} /> }
      </div>
    );
  }
}

PerformanceScreen.displayName = 'PerformanceScreen';
PerformanceScreen.propTypes = {};
PerformanceScreen.defaultProps = {};

export default PerformanceScreen;
