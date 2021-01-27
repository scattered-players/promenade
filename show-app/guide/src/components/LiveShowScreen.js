import React from 'react';
import config from 'config';

import phaseKindsEnum from '../enum/phasesKinds';
import WebpageScreen from './WebpageScreen';
import IntroScreen from './IntroScreen';
import FreeplayScreen from './FreeplayScreen';
import EndingScreen from './EndingScreen';
import KickScreen from './KickScreen';

import PartySidebar from './PartySidebar';
import VideoRow from './VideoRow';

import './liveshowscreen.scss';

class LiveShowScreen extends React.Component {
  render() {
    const { actions, system, navWorker } = this.props;
    const {
      localStream
    } = system;
    const screenDict = {
      [phaseKindsEnum.WEB_PAGE]: WebpageScreen,
      // [showStatusEnum.INTRO]: IntroScreen,
      // [showStatusEnum.FREEPLAY]: FreeplayScreen,
      // [showStatusEnum.ENDING]: EndingScreen,
      [phaseKindsEnum.KICK]: KickScreen,
    };
    const CurrentScreen = screenDict[system.currentShow.currentPhase.kind];
    return (
      <div className="liveshowscreen-component">
        <div className="main-area">
          {
            !config.IS_MOBILE && (
              <CurrentScreen actions={actions} system={system} navWorker={navWorker}/>
            )
          }
        </div>
        <PartySidebar system={system} actions={actions} />
        { !config.IS_MOBILE && localStream && <VideoRow system={system} actions={actions} /> }
      </div>
    );
  }
}

LiveShowScreen.displayName = 'LiveShowScreen';
LiveShowScreen.propTypes = {};
LiveShowScreen.defaultProps = {};

export default LiveShowScreen;
