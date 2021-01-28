import _ from 'lodash';
import React from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography
} from '@material-ui/core';

import './videochoicescreen.scss';

class VideoChoiceScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      needsUserClick: false
    };

    this.playVideo = this.playVideo.bind(this);
  }
  
  componentDidMount() {
    this.playVideo();
  }

  async playVideo() {
    console.log('ATTEMPTING TO PLAY ENDING');
    const { chosenVideo } = this.refs;
    try {
      await chosenVideo.play();
      console.log('YAY ENDING');
    } catch(e) {
      console.error('UHOH ENDING:', e);
      this.setState({needsUserClick: true})
    }
  }

  render() {
    const {
      system: {
        myParty,
        currentShow: {
          currentPhase
        }
      }
    } = this.props;
    const videoSrc = _.find(myParty.videoChoices, choice => choice.phase._id === currentPhase._id).choiceURL;
    const {
      needsUserClick
    } = this.state;
    return (
      <div className="videochoicescreen-component">
        <video ref="chosenVideo" src={videoSrc} playsInline></video>
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
      </div>
    );
  }
}

VideoChoiceScreen.displayName = 'VideoChoiceScreen';
VideoChoiceScreen.propTypes = {};
VideoChoiceScreen.defaultProps = {};

export default VideoChoiceScreen;
