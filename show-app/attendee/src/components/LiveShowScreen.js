import React from 'react';
import config from 'config';

import showStatusEnum from '../enum/showStatus';
import PreshowScreen from './PreshowScreen';
import IntroScreen from './IntroScreen';
import FreeplayScreen from './FreeplayScreen';
import EndingScreen from './EndingScreen';
import PostshowScreen from './PostshowScreen';

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
      [showStatusEnum.PRESHOW]: PreshowScreen,
      [showStatusEnum.INTRO]: IntroScreen,
      [showStatusEnum.FREEPLAY]: FreeplayScreen,
      [showStatusEnum.ENDING]: EndingScreen,
      [showStatusEnum.HAS_ENDED]: PostshowScreen,
    };
    const CurrentScreen = screenDict[system.currentShow.state];
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
