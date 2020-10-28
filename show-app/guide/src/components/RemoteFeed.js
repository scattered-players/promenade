import React from 'react';
import { Janus } from 'janus-gateway';
import './remotefeed.scss';

class RemoteFeed extends React.Component {

  componentDidUpdate(){
    const { attendee: { feed } } = this.props;
    const theVideo = this.refs.videofeed;
    if(feed && feed.stream && theVideo && theVideo.srcObject !== feed.stream){
      Janus.attachMediaStream(this.refs.videofeed, feed.stream);
    }
  }

  render() {
    const { attendee } = this.props;
    return (
      <>
      <p>{attendee.username}</p>
      {
        attendee.feed && attendee.feed.stream && <video className="remote-feed" ref="videofeed" autoPlay playsInline/>
      }
      </>
    );
  }
}

RemoteFeed.displayName = 'RemoteFeed';
RemoteFeed.propTypes = {};
RemoteFeed.defaultProps = {};

export default RemoteFeed;
