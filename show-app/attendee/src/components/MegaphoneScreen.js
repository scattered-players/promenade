import React from 'react';
import {
  Typography
} from '@material-ui/core';
import VideoFeed from './VideoFeed';
import './megaphonescreen.scss';

class MegaphoneScreen extends React.Component {

  render() {
    let {
      system: {
        myParty: {
          guide
        },
        isNerdy
      },
      actions
    } = this.props;
    return (
      <div className="megaphonescreen-component">
      <Typography className="character-nametag">{guide && guide.characterName}</Typography>
      { guide && guide.feed && <VideoFeed feed={guide.feed} isLocal={false} hasOverlay={false} isNerdy={isNerdy}/> }
      </div>
    );
  }
}

MegaphoneScreen.displayName = 'MegaphoneScreen';
MegaphoneScreen.propTypes = {};
MegaphoneScreen.defaultProps = {};

export default MegaphoneScreen;
