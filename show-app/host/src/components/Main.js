import React from 'react';

import HostStage from './HostStage';
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
    } = actions;
    const {
      user,
      isAuthenticating,
      triedAuthentication,
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
    const { actions, system, snackbar, ballroom } = this.props;
    const {
      isNerdy
    } = system;

    return (
      <>
        <div className="actor-app">
          <div ref="statsContainer" className={'stats-container' + (isNerdy ? ' show-stats' : ' hide-stats')}></div>
          <HostStage ballroom={ballroom} actions={actions}/>
        </div>
      </>
    );
  }
}

Main.displayName = 'Main';
Main.propTypes = {};
Main.defaultProps = {};

export default Main;
