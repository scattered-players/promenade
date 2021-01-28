import React from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography
} from '@material-ui/core';

import './staticvideoscreen.scss';

class StaticVideoScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      needsUserClick: false
    };

    this.playVideo = this.playVideo.bind(this);
  }
  
  componentDidMount() {
    const { staticVideo } = this.refs;
    staticVideo.addEventListener('playing', () => {
      console.log('VIDEO PLAYING!');
    });
    this.playVideo();
  }

  async playVideo() {
    console.log('ATTEMPTING TO PLAY INTRO');
    const { staticVideo } = this.refs;
    try {
      await staticVideo.play();
      console.log('YAY INTRO');
    } catch(e) {
      console.error('UHOH INTRO:', e);
      this.setState({needsUserClick: true})
    }
  }

  render() {
    const {
      system: {
        currentShow: {
          currentPhase
        }
      }
    } = this.props,
    {
      needsUserClick
    } = this.state;

    return (
      <>
        <div className="staticvideoscreen-component">
          <div className="static-video-wrapper">
            <video className="static-video" ref="staticVideo" src={currentPhase.attributes.url} crossOrigin="anonymous" playsInline></video>
          </div>
        </div>
        <Dialog onClose={() => this.setState({needsUserClick: false}, this.playVideo)} open={needsUserClick}>
          <DialogContent>
            <Typography variant="body1">Click continue to view the video</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({needsUserClick: false}, this.playVideo)}>
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

StaticVideoScreen.displayName = 'StaticVideoScreen';
StaticVideoScreen.propTypes = {};
StaticVideoScreen.defaultProps = {};

export default StaticVideoScreen;
