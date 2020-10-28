import React from 'react';
import config from 'config';
import assetKey from 'custom/assetKey';
import { v4 as uuid } from 'uuid';

import {
  mainFps,
  ramStats,
  workerFps
} from '../util/stats';
import NavigationPlugin from 'custom/NavigationPlugin';

import './main.scss';

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      places:Object.keys(assetKey).map(key => ({
        _id: uuid(),
        assetKey: key,
        characterName: key,
        placeName:key
      })),
      selectedPlace: null,
      isInTransit: false
    };
    
    window.getNavState = () => this.state;
    window.setNavState = this.setState.bind(this);
    window.goToPlace = key => {
      let matchingPlaces = this.state.places.filter(place => place.assetKey === key);
      this.setState({
        selectedPlace: matchingPlaces[0]
      });
    };
    window.goNowhere = key => {
      this.setState({
        selectedPlace: null
      });
    };
    window.grandTour = () => {
      let keys = Object.keys(assetKey);
      let goNext = () => {
        let key = keys.pop();
        keys.unshift(key);
        console.log(`GOING: ${key}`);
        goToPlace(key);
        setTimeout(goNext, 10000);
      };
      goNext();
    };
    this.updateNavScreen = this.updateNavScreen.bind(this);
  }

  updateNavScreen() {
    if (this.navWorker) {
      this.navWorker.sendMessage(JSON.parse(JSON.stringify({
        type:'UPDATE',
        state: this.state
      })));
    }
  }

  componentDidMount() {
    const {
      statsContainer
    } = this.refs;
    statsContainer.appendChild(mainFps.dom);
    statsContainer.appendChild(ramStats.dom);
    statsContainer.appendChild(workerFps.dom);
    this.navWorker = new NavigationPlugin(workerFps);
    this.navWorker.newCanvas(this.refs.canvas);
    this.updateNavScreen();
  }

  componentDidUpdate() {
    this.updateNavScreen();
  }

  componentWillUnmount() {
    if (this.navWorker) {
      this.navWorker.destroy();
      this.navWorker = null;
    }
  }

  render() {
    return (
      <React.Fragment>
        <div ref="statsContainer" className="stats-container"></div>
        <canvas className="navigation-canvas" ref="canvas"></canvas>
      </React.Fragment>
    );
  }
}

Main.displayName = 'Main';
Main.propTypes = {};
Main.defaultProps = {};

export default Main;
