import React from 'react';
import './streamingending.scss';

class StreamingEnding extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      needsUserClick: false
    };

    this.playEnding = this.playEnding.bind(this);
  }

  componentDidMount() {
    const { actions: { joinStream }, system: { currentShow } } = this.props;
    joinStream(`wss://janus.${config.JANUS_DOMAIN}:8989/`, currentShow._id);
  }

  componentDidUpdate(){
    let { system: { streamingFeed } } = this.props;
    const theVideo = this.refs.videofeed;
    if(streamingFeed && streamingFeed.stream && theVideo && theVideo.srcObject !== streamingFeed.stream){
      theVideo.addEventListener('playing', () => {
        console.log('ENDING PLAYING');
        // this.setState({ needsUserClick: false });
      });
      Janus.attachMediaStream(theVideo, streamingFeed.stream);
      this.playEnding();
    }
  }

  async playEnding() {
    console.log('ATTEMPTING TO PLAY ENDING');
    const theVideo = this.refs.videofeed;
    try {
      await theVideo.play();
      console.log('YAY ENDING');
    } catch(e) {
      console.error('UHOH ENDING:', e);
      this.setState({needsUserClick: true})
    }
  }

  componentWillUnmount(){
    const { actions: { leaveStream } } = this.props;
    leaveStream()
  }


  render() {
    let { system: { streamingFeed } } = this.props;
    let { needsUserClick } = this.state;
    return (
      <div className="streamingending-component">
      {
        streamingFeed && streamingFeed.stream && <video className="ending-video" ref="videofeed" playsInline/>
      }
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

StreamingEnding.displayName = 'StreamingEnding';
StreamingEnding.propTypes = {};
StreamingEnding.defaultProps = {};

export default StreamingEnding;
