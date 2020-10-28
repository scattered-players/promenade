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

  componentDidMount() {
    const {
      system: {
        muteNavMusic
      }
    } = this.props;
    !muteNavMusic && playAudio(NAV_ARRIVAL_SOUND);
  }

  render() {
    let {
      system: {
        actorFeed,
        currentPlace,
        isNerdy
      },
      actions
    } = this.props;
    return (
      <div className="interactionscreen-component">
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
