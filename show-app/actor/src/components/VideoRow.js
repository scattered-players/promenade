import React from 'react';
import config from 'config';

import {
  JANUS_MODE
} from 'custom/config.json';

import {
  Typography
} from '@material-ui/core';

import './videorow.scss';

import VideoFeed from './VideoFeed';

class VideoRow extends React.Component {

  componentDidMount() {
    const {
      actions: {
        joinVideoRoom
      },
      system: {
        myPlace,
        currentParty,
        audioMute,
        videoMute,
        localOutputStream
      }
    } = this.props;
    const janusSubdomain = (JANUS_MODE === 'SINGLE') ? 'janus' : currentParty.janusId;
    joinVideoRoom(`wss://${janusSubdomain}.${config.JANUS_DOMAIN}:8989/`, currentParty._id, myPlace._id, audioMute, videoMute, localOutputStream);
  }

  componentWillUnmount(){
    const { actions: { leaveVideoRoom } } = this.props;
    leaveVideoRoom()
  }

  render() {
    let {
      actions,
      system: {
        currentParty,
        isNerdy
      }
    } = this.props;
    return (
      <div className="video-row">
      {
        currentParty.guide && currentParty.guide.isOnline &&
        <div className="video-feed-wrapper">
          <div className="nametag-wrapper-wrapper">
            <div className="nametag-wrapper">
              <Typography variant="body1" className="nametag">{ 'GUIDE ' + currentParty.guide.characterName}</Typography>
            </div>
          </div>
          { currentParty.guide.feed && <VideoFeed actions={actions} attendee={currentParty.guide} feed={currentParty.guide.feed} isNerdy={isNerdy} isGuide={true} /> }
        </div>
      }
      {
        currentParty.attendees.filter(attendee => !attendee.isBlocked && attendee.isOnline).map(attendee => (
          <div className="video-feed-wrapper" key={attendee._id}>
            <div className="nametag-wrapper-wrapper">
              <div className="nametag-wrapper">
                <Typography variant="body1" className="nametag">{attendee.username}</Typography>
              </div>
            </div>
            { attendee.feed && <VideoFeed actions={actions} attendee={attendee} feed={attendee.feed} isNerdy={isNerdy} isGuide={false} /> }
          </div>
        ))
      }
      </div>
    );
  }
}

VideoRow.displayName = 'VideoRow';
VideoRow.propTypes = {};
VideoRow.defaultProps = {};

export default VideoRow;
