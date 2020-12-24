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

const urlParams = new URLSearchParams(window.location.search);
const streamId = urlParams.get('streamId') || 'heyo';

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
      liveui: false,
      muted: true,
      sources: [{
        src: `${config.STREAM_HOST}/${streamId}/index.m3u8`,
        type: 'application/x-mpegURL'
      }]
    }, function onPlayerReady() {
      console.log('onPlayerReady', this)

      this.on('error', e => {
        console.log('OHNO', e);
        setTimeout(() => {
          console.log('HMM', this)
          this.src([{
            src: `${config.STREAM_HOST}/${streamId}/index.m3u8`,
            type: 'application/x-mpegURL'
          }])
          // this.play()
        }, 1000);
        
        // var time = this.currentTime();

        // if(this.error().code === 2) {
        //     this.error(null).pause().load().currentTime(time).play();
        // }
      })
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
          <video ref={ node => this.videoNode = node } className="video-js" style={{width:'100vw', height:'100vh'}}></video>
        </div>
      </React.Fragment>
    );
  }
}

Main.displayName = 'Main';
Main.propTypes = {};
Main.defaultProps = {};

export default Main;
