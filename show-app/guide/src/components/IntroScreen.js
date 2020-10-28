import React from 'react';
import {
  INTRO_VIDEO
} from 'custom/config.json'

import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography
} from '@material-ui/core';

// import IntroWorker from '../util/IntroWorker';

import './introscreen.scss';

class IntroScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      needsUserClick: false
    };

    this.playIntro = this.playIntro.bind(this);
  }
  
  componentDidMount() {
    const { introVideo } = this.refs;
    introVideo.addEventListener('playing', () => {
      console.log('INTRO PLAYING!')
      
      const {
        system: {
          currentShow: {
            introStartTime
          }
        }
      } = this.props;

      if(introStartTime){
        introVideo.currentTime = (Date.now() - introStartTime)/1000;
      } else {
        setTimeout(() => {
          const {
            system: {
              currentShow: {
                introStartTime
              }
            }
          } = this.props;
          const { introVideo } = this.refs;
          if(introStartTime){
            introVideo.currentTime = (Date.now() - introStartTime)/1000;
          }
        },1000);
      }
    });
    this.playIntro();
    
    // this.introWorker = new IntroWorker(this.refs.canvas);
  }

  async playIntro() {
    console.log('ATTEMPTING TO PLAY INTRO');
    const { introVideo } = this.refs;
    try {
      await introVideo.play();
      console.log('YAY INTRO');
    } catch(e) {
      console.error('UHOH INTRO:', e);
      this.setState({needsUserClick: true})
    }
  }

  componentWillUnmount(){
    if (this.introWorker) {
      this.introWorker.destroy();
      this.introWorker = null;
    }
  }

  render() {
    const {
      needsUserClick
    } = this.state;

    return (
      <>
        <div className="introscreen-component">
          <div className="canvas-wrapper">
            {/* <canvas className="intro-canvas" ref="canvas"></canvas> */}
            <video className="intro-canvas" ref="introVideo" src={INTRO_VIDEO} crossOrigin="anonymous" playsInline></video>
          </div>
        </div>
        <Dialog onClose={() => this.setState({needsUserClick: false}, this.playIntro)} open={needsUserClick}>
          <DialogContent>
            <Typography variant="body1">Click continue to view the intro</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({needsUserClick: false}, this.playIntro)}>
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

IntroScreen.displayName = 'IntroScreen';
IntroScreen.propTypes = {};
IntroScreen.defaultProps = {};

export default IntroScreen;
