import React from 'react';

import {
  USER_AVATAR
} from 'custom/config.json';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip
} from '@material-ui/core';

import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import BlockIcon from '@material-ui/icons/Block';
import RefreshIcon from '@material-ui/icons/Refresh';

import './attendeevideofeed.scss';

class AttendeeVideoFeed extends React.Component {
  constructor() {
    super();
    this.state = {
      blockDialogOpen: false,
      currentResolution: '',
      currentBitrate:'0 kbits/sec',
      currentFramerate: 0
    };
    this.updateFeedStats = this.updateFeedStats.bind(this);
  }

  componentDidMount() {
    this.feedStatsInterval = setInterval(this.updateFeedStats, 1000);
  }

  componentDidUpdate(){
    const { feed } = this.props;
    const theVideo = this.refs.videofeed;
    if(feed.stream && theVideo && theVideo.srcObject !== feed.stream) {
      theVideo.srcObject = feed.stream;
      // theVideo.play().catch(e =>{
      //   console.error('ERROR PLAYING VIDEO FEED:', e);
      //   let message = 'Failed to play audience feed';
      //   reportError({
      //     type:'AUTOPLAY_FAIL',
      //     message: `${message}: ${e.message || e}`
      //   })();
      // });
    }
  }

  updateFeedStats() {
    const {
      feed,
      isNerdy,
      isGuide
    } = this.props;
    if(isNerdy){
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
      actions: {
        blockUser,
        forceRefreshUser,
        setRemoteMutes
      },
      attendee,
      feed,
      isNerdy,
      isGuide,
      shouldMute
    } = this.props;
    const {
      isAudioMuted,
      isVideoMuted
    } = attendee;
    const {
      currentResolution,
      currentBitrate,
      currentFramerate,
      blockDialogOpen
    } = this.state;
    const tracks = feed.stream && feed.stream.getVideoTracks(),
      hasVideo = !!(tracks && tracks.length);
    return (
      <div className="attendeevideofeed-component">
        {
          feed.stream && <video className={ (tracks && tracks.length) ? 'video-visible' : 'video-hide' } ref="videofeed" playsInline autoPlay muted={shouldMute}/>
        }
        {
          !hasVideo && (
            <div className="star-jockey-placeholder">
              <img src={USER_AVATAR} />
            </div>
          )
        }
        {
          !isGuide && 
          <div className="button-row">
            <div className="button-row-backdrop"></div>
            <IconButton color="inherit" onClick={() => setRemoteMutes(attendee._id, !isAudioMuted, isVideoMuted) }>
              { isAudioMuted ? <MicOffIcon fontSize="small" color="secondary"/> : <MicIcon fontSize="small" color="primary" />}
            </IconButton>
            <IconButton color="inherit" onClick={() => setRemoteMutes(attendee._id, isAudioMuted, !isVideoMuted) }>
              { isVideoMuted ? <VideocamOffIcon fontSize="small" color="secondary" /> : <VideocamIcon fontSize="small" color="primary" />}
            </IconButton>
            <Tooltip title="Block user">
              <IconButton onClick={() => this.setState({blockDialogOpen: true})}>
                <BlockIcon style={{ color: 'black' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh user's browser">
              <IconButton onClick={() => forceRefreshUser(attendee._id)}>
                <RefreshIcon style={{ color: 'black' }} />
              </IconButton>
            </Tooltip>
          </div>
        }
        <Dialog onClose={() => this.setState({blockDialogOpen: false})} open={blockDialogOpen}>
          <DialogTitle>Block this user?</DialogTitle>
          <DialogContent>Do you want to block {attendee.username}? They will not be able to get back into the app ever again.</DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({blockDialogOpen: false})}>Cancel</Button>
            <Button onClick={() => { blockUser(attendee._id); this.setState({blockDialogOpen: false})}}>Block</Button>
          </DialogActions>
        </Dialog>
        {
          isNerdy && (
            <div className="feed-stats">
              { `${currentResolution} ${currentFramerate}FPS ${currentBitrate}` }
            </div>
          )
        }
      </div>
    );
  }
}

AttendeeVideoFeed.displayName = 'AttendeeVideoFeed';
AttendeeVideoFeed.propTypes = {};
AttendeeVideoFeed.defaultProps = {};

export default AttendeeVideoFeed;
