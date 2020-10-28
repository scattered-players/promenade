import React from 'react';
import config from 'config';
import {
  USER_AVATAR
} from 'custom/config.json';

import './videofeed.scss';

class VideoFeed extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentResolution: '',
      currentBitrate:'0 kbits/sec',
      currentFramerate: 0
    };

    this.updateFeedStats = this.updateFeedStats.bind(this);
  }

  componentDidMount() {
    this.feedStatsInterval = setInterval(this.updateFeedStats, 1000);
  }

  componentDidUpdate() {
    const {
      feed,
      isLocal
    } = this.props;
    const theVideo = this.refs.videofeed;
    if(feed.stream && theVideo && theVideo.srcObject !== feed.stream){
      theVideo.srcObject = feed.stream;
      // theVideo.play()
      //   .catch(e => {
      //     console.error('ERROR PLAYING VIDEO FEED:', e);
      //     let message = isLocal ? 'Failed to play local feed' : (!hasOverlay ? 'Failed to play actor feed' : 'Failed to play audience feed')
      //     reportError({
      //       type:'AUTOPLAY_FAIL',
      //       message: `${message}: ${e.message || e}`
      //     })();
      //   });
    }
  }

  updateFeedStats() {
    const {
      feed,
      isLocal,
      isNerdy
    } = this.props;
    if(!isLocal && isNerdy){
      const theVideo = this.refs.videofeed;

      let currentBitrate = '0 kbits/sec';
      let currentResolution = '0x0';
      let currentFramerate = 0;
      if(feed && feed.remoteFeed && feed.remoteFeed.getBitrate) {
        currentBitrate = feed.remoteFeed.getBitrate()
      }

      if(theVideo){
        currentResolution = theVideo.videoWidth + 'x' + theVideo.videoHeight;
      }
      
      if(feed.stream && feed.stream.getVideoTracks() && feed.stream.getVideoTracks().length) {
        let settings = feed.stream.getVideoTracks()[0].getSettings()
        currentFramerate = Math.round(settings.frameRate);
      }
      
      this.setState({
        currentBitrate,
        currentResolution,
        currentFramerate
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.feedStatsInterval);
  }

  render() {
    const {
      feed,
      isDecider,
      isLocal,
      hasOverlay,
      overlayDelay,
      isLocalVideoMuted,
      isNerdy,
      shouldMute
    } = this.props;
    const {
      currentResolution,
      currentBitrate,
      currentFramerate
    } = this.state;
    const tracks = feed.stream && feed.stream.getVideoTracks(),
      hasVideo = !!(tracks && tracks.length) && (!isLocal || !isLocalVideoMuted);
    const classes = [];
    // console.log('TRACKS', tracks);
    classes.push(hasVideo ? 'video-visible' : 'video-hide');
    if(!isLocal && hasOverlay) {
      classes.push('remote-video');
    }
    // if(!config.IS_MOBILE && !isLocal && !hasOverlay && feed && feed.stream) {
    //   let settings = feed.stream.getVideoTracks()[0].getSettings();
    //   if (settings.aspectRatio >= 1){
    //     classes.push('fit-video');
    //   }
    // }
    return (
      <div className={"videofeed-component" + (isDecider ? ' decider' : '')}>
        <div className="video-wrapper">
          {hasOverlay && <div className="video-overlay" style={{animationDuration: (1.7 + overlayDelay) + 's'}}></div>}
          {
            feed.stream && <video className={ classes.join(' ') } ref="videofeed" autoPlay playsInline muted={isLocal || shouldMute} />
          }
          {
            !hasVideo && hasOverlay && !!USER_AVATAR && (
              <div className="star-jockey-placeholder">
                <img src={USER_AVATAR} />
              </div>
            )
          }
          {
            !isLocal && isNerdy && (
              <div className="feed-stats">
                { `${currentResolution} ${currentFramerate}FPS ${currentBitrate}` }
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

VideoFeed.displayName = 'VideoFeed';
VideoFeed.propTypes = {};
VideoFeed.defaultProps = {};

export default VideoFeed;
