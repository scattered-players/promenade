import React from 'react';
import {
  NAV_ARRIVAL_SOUND
} from 'custom/config.json';

import {
  Typography
} from '@material-ui/core';

import VideoFeed from './VideoFeed';

import playAudio from '../util/audio';

import './interactionscreen.scss';

class InteractionScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime: 0,
      elapsedTime: 0
    }
  }

  componentDidMount() {
    const {
      system: {
        muteNavMusic
      }
    } = this.props;
    !muteNavMusic && playAudio(NAV_ARRIVAL_SOUND);
    
    this.setState({
      startTime: Date.now(),
      elapsedTime: 0
    });
    this.timer = setInterval(() => {
      console.log('TIMER');
      this.setState({
        elapsedTime: (Date.now() - this.state.startTime)
      })
    }, 500);
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  render() {
    let {
      system: {
        actorFeed,
        currentPlace,
        isNerdy
      },
      actions
    } = this.props,
    {
      elapsedTime
    } = this.state;
    const elapsedMinutes = Math.floor(Math.round(elapsedTime/1000)/60);
    const elapsedSeconds = Math.round(elapsedTime/1000) % 60;
    return (
      <div className="interactionscreen-component">
        {
          elapsedTime > 0 &&
          <div className="elapsed-time">
            {elapsedMinutes > 0 && `${elapsedMinutes} min `}
            { `${elapsedSeconds} sec` }
          </div>
        }
        <Typography className="character-nametag">{currentPlace && currentPlace.characterName}</Typography>
        { actorFeed && <VideoFeed feed={actorFeed} isLocal={false} hasOverlay={false} isNerdy={isNerdy}/> }
      </div>
    );
  }
}

InteractionScreen.displayName = 'InteractionScreen';
InteractionScreen.propTypes = {};
InteractionScreen.defaultProps = {};

export default InteractionScreen;
