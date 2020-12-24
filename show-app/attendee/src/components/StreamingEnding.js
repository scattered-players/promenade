import React from 'react';
import config from 'config';
import videojs from 'video.js';

import 'video.js/dist/video-js.css';
import './streamingending.scss';

class StreamingEnding extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    let { system: { currentShow: { _id:showId} } } = this.props;
    this.player = videojs(this.videoNode, {
      autoplay: true,
      controls: true,
      muted: false,
      sources: [{
        src: `${config.STREAM_HOST}/${showId}/index.m3u8`,
        type: 'application/x-mpegURL'
      }]
    }, function onPlayerReady() {
      console.log('onPlayerReady', this)
    });
  }

  componentWillUnmount(){
    if(this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div className="streamingending-component">
        <div data-vjs-player>
          <video ref={ node => this.videoNode = node } className="video-js"></video>
        </div>
      </div>
    );
  }
}

StreamingEnding.displayName = 'StreamingEnding';
StreamingEnding.propTypes = {};
StreamingEnding.defaultProps = {};

export default StreamingEnding;
