import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography
} from '@material-ui/core';
import './backgroundaudio.scss';

class BackgroundAudio extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      needsUserClick: false
    };

    this.playAudio = this.playAudio.bind(this);
  }

  componentDidMount(){
    this.playAudio();
  }

  componentDidUpdate() {
    const {
      audioVolume,
    } = this.props;

    if(this.gainNode){
      this.gainNode.gain.value = Math.min(1, audioVolume);
    }
  }

  async playAudio() {
    console.log('ATTEMPTING TO PLAY INTRO');
    try {
      const {
        audioPath,
        mixerContext,
        mixerOutput,
        audioVolume
      } = this.props;
      let response = await fetch(audioPath);
      let arrayBuffer = await response.arrayBuffer();
      console.log('ARRAYBUFFER', arrayBuffer);
      mixerContext.decodeAudioData(arrayBuffer, audioBuffer => {
        console.log('AUDIOBUFFER', audioBuffer);
        
        this.musicSource = mixerContext.createBufferSource();
        console.log('MUSICSOURCE', this.musicSource);
        this.musicSource.buffer = audioBuffer;
        this.musicSource.loop = true;
        this.gainNode = mixerContext.createGain()
        this.gainNode.gain.value = Math.min(1, audioVolume);
        this.musicSource.connect(this.gainNode);
        this.gainNode.connect(mixerOutput);
        this.musicSource.start();
        console.log('YAY AUDIO');
      }, e => {
        console.error('UGH', e);
        this.setState({needsUserClick: true})
      });
    } catch(e) {
      console.error('UHOH AUDIO:', e);
      this.setState({needsUserClick: true})
    }
  }

  componentWillUnmount() {
    if (this.musicSource) {
      this.gainNode.disconnect();
      this.gainNode = null;
      this.musicSource.disconnect();
      this.musicSource = null;
    }
  }


  render() {
    const {
      needsUserClick
    } = this.state;
    return (
      <div className="backgroundaudio-component">
        <Dialog onClose={() => this.setState({needsUserClick: false}, this.playAudio)} open={needsUserClick}>
          <DialogContent>
            <Typography variant="body1">Click continue to play background audio</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({needsUserClick: false}, this.playAudio)}>
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

BackgroundAudio.displayName = 'BackgroundAudio';
BackgroundAudio.propTypes = {};
BackgroundAudio.defaultProps = {};

export default BackgroundAudio;
