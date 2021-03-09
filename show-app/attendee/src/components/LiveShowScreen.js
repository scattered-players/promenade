import React from 'react';
import config from 'config';

import phaseKindsEnum from '../enum/phasesKinds';
import WebpageScreen from './WebpageScreen';
import StaticVideoScreen from './StaticVideoScreen';
import FreeplayScreen from './FreeplayScreen';
import LivestreamScreen from './LivestreamScreen';
import VideoChoiceScreen from './VideoChoiceScreen';
import KickScreen from './KickScreen';

import PartySidebar from './PartySidebar';
import VideoRow from './VideoRow';

import NavigationPlugins from 'custom/NavigationPlugins';
const NAV_WORKER_NAMES = Object.keys(NavigationPlugins);

import {
  workerFps
} from '../util/stats';

import './liveshowscreen.scss';

class LiveShowScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {};

    if (!config.IS_MOBILE) {
      this.navWorkerDict = {};
      NAV_WORKER_NAMES.map(name => {
        const NavigationPlugin = NavigationPlugins[name];
        if (NavigationPlugin) {
          this.navWorkerDict[name] = new NavigationPlugin(workerFps);
        }
      });
    }
    this.updateNavScreen = this.updateNavScreen.bind(this);
  }

  updateNavScreen() {
    const {
      system: {
        currentShow,
        places,
        myParty
      }
    } = this.props;

    if (myParty && this.navWorkerDict && currentShow && currentShow.currentPhase.attributes && this.navWorkerDict[currentShow.currentPhase.attributes.navWorkerName]) {
      const {
        selectedPlace
      } = myParty;
      this.navWorkerDict[currentShow.currentPhase.attributes.navWorkerName].sendMessage(JSON.parse(JSON.stringify({
        type:'UPDATE',
        state: {
          places,
          myParty,
          selectedPlace,
          isInTransit: !!myParty.nextPlace
        }
      })));
    }
  }

  componentDidMount() {
    this.updateNavScreen();
  }

  componentDidUpdate() {
    this.updateNavScreen();
  }

  componentWillUnmount() {
    if (this.navWorkerDict) {
      NAV_WORKER_NAMES.map(name => {
        if(this.navWorkerDict[name]){
          this.navWorkerDict[name].destroy();
        }
      });
      this.navWorkerDict = null;
    }
  }

  render() {
    const { actions, system } = this.props;
    const {
      localStream
    } = system;
    const screenDict = {
      [phaseKindsEnum.WEB_PAGE]: WebpageScreen,
      [phaseKindsEnum.STATIC_VIDEO]: StaticVideoScreen,
      [phaseKindsEnum.FREEPLAY]: FreeplayScreen,
      [phaseKindsEnum.LIVESTREAM]: LivestreamScreen,
      [phaseKindsEnum.VIDEO_CHOICE]: VideoChoiceScreen,
      [phaseKindsEnum.KICK]: KickScreen,
    };
    const CurrentScreen = screenDict[system.currentShow.currentPhase.kind];
    let phaseClassName = system.currentShow.currentPhase.name.toLowerCase().replace(' ', '-') + '-phase';
    return (
      <div className={ "liveshowscreen-component " + phaseClassName}>
        <div className="main-area">
          {
            !config.IS_MOBILE && (
              [
                <CurrentScreen key={system.currentShow.currentPhase._id} actions={actions} system={system} navWorker={system.currentShow.currentPhase.attributes && this.navWorkerDict[system.currentShow.currentPhase.attributes.navWorkerName]}/>
              ]
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
