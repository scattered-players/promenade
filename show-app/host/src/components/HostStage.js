import React from 'react';
import hostScene from 'custom/HostPlugin';
import './hoststage.scss';

class HostStage extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };

    this.onKeyPress = this.onKeyPress.bind(this);
  }

  updateAiScreen(){
    const {
      ballroom
    } = this.props;
    this.hostScene.sendMessage(JSON.parse(JSON.stringify({
      type:'UPDATE',
      state: ballroom
    })));
  }

  componentDidMount() {
    let { sourceCanvas } = this.refs;
    this.hostScene = hostScene.start(sourceCanvas);
    setImmediate(() => {
      this.updateAiScreen();
    })
    window.addEventListener('keypress', this.onKeyPress);
  }

  onKeyPress(e){
    console.log('HEYO', e.keyCode);
    const {
      actions:{
        chooseShip,
        pullItem,
        activateAnsible,
        sendToOutroVideo
      },
      ballroom: {
        isAnsibleActive
      }
    } = this.props;
    if(e.keyCode >= 48 && e.keyCode <=57){
      chooseShip(e.keyCode - 49);
    } else if(e.keyCode == 32) {
      pullItem();
    } else if(e.keyCode == 13) {
      if(!isAnsibleActive){
        activateAnsible();
      } else {
        sendToOutroVideo();
      }
    }
  }

  componentDidUpdate(prevProps) {
    if(this.hostScene){
      this.updateAiScreen();
    }
    const {
      ballroom: {
        isShowingOutro
      }
    } = this.props;
    const {
      transitioningToOutro
    } = this.state;
    if(isShowingOutro && !prevProps.ballroom.isShowingOutro && !transitioningToOutro) {
      this.setState({ transitioningToOutro: true}, () => {
        
      });
    }
  }

  componentWillUnmount() {
    if(this.hostScene){
      this.hostScene.destroy();
      this.hostScene = null;
    }
    window.removeEventListener('keypress', this.onKeyPress);
  }

  render() {
    const {
      transitioningToOutro
    } = this.state;

    return (
      <>
        <canvas style={{ opacity: transitioningToOutro ? 0 : 1 }} className="stage-canvas" ref="sourceCanvas"></canvas>
        { transitioningToOutro && <video className="outro-video" src={`/media/video/outro.mp4`} autoPlay={true} playsInline={true}/> }
      </>
    );
  }
}

HostStage.displayName = 'HostStage';
HostStage.propTypes = {};
HostStage.defaultProps = {};

export default HostStage;
