import React from 'react';
import videojs from 'video.js';
import config from 'config';

import {
  mainFps,
  ramStats,
  workerFps
} from '../util/stats';

import 'video.js/dist/video-js.css';
import './main.scss';

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.player = videojs(this.videoNode, {
      autoplay: true,
      controls: true,
      muted: true,
      sources: [{
        src: `${config.STREAM_HOST}/live/heyo/index.m3u8`,
        type: 'application/x-mpegURL'
      }]
    }, function onPlayerReady() {
      console.log('onPlayerReady', this)
    });

  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <React.Fragment>
        <div data-vjs-player>
          <video ref={ node => this.videoNode = node } className="video-js"></video>
        </div>
      </React.Fragment>
    );
  }
}

Main.displayName = 'Main';
Main.propTypes = {};
Main.defaultProps = {};

export default Main;
