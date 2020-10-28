import React from 'react';
import config from 'config';

import {
  ENDING_VIDEO_CHOICES
} from 'custom/config.json';

import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography
} from '@material-ui/core';

import './prerecordedending.scss';

class PreRecordedEnding extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      needsUserClick: false
    };

    this.playEnding = this.playEnding.bind(this);
  }
  
  componentDidMount() {
    this.playEnding();
  }

  async playEnding() {
    console.log('ATTEMPTING TO PLAY ENDING');
    const { endingVideo } = this.refs;
    try {
      await endingVideo.play();
      console.log('YAY ENDING');
      endingVideo.onended = () => { 
        location.href = '/program.html';
      };
    } catch(e) {
      console.error('UHOH ENDING:', e);
      this.setState({needsUserClick: true})
    }
  }

  render() {
    const { system: { myParty } } = this.props;
    const videoSrc = myParty.chosenEndingURL || ENDING_VIDEO_CHOICES[0];
    const {
      needsUserClick
    } = this.state;
    return (
      <div className="prerecordedending-component">
        <video className="ending-video" ref="endingVideo" src={videoSrc} playsInline></video>
        <Dialog onClose={() => this.setState({needsUserClick: false}, this.playEnding)} open={needsUserClick}>
          <DialogContent>
            <Typography variant="body1">Click continue to view the ending</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({needsUserClick: false}, this.playEnding)}>
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

PreRecordedEnding.displayName = 'PreRecordedEnding';
PreRecordedEnding.propTypes = {};
PreRecordedEnding.defaultProps = {};

export default PreRecordedEnding;
