import React from 'react';
import './volumemeter.scss';

class VolumeMeter extends React.Component {
  constructor(props){
    super(props);
    this.state= {
      isReceivingAudio: false
    };

    this.renderMeter = this.renderMeter.bind(this);
  }

  componentDidMount(){
    const {
      stream
    } = this.props,
    {
      volumeMeterCanvas
    } = this.refs;
    this.canvasCtx = volumeMeterCanvas.getContext('2d');
    this.canvasWidth = volumeMeterCanvas.width;
    this.canvasHeight = volumeMeterCanvas.height;

    this.audioContext = new AudioContext();
    this.source = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();

    this.source.connect(this.analyser);
    this.analyser.fftSize = 32;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);


    this.rAF = requestAnimationFrame(this.renderMeter);
  }

  renderMeter() {
    this.canvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.analyser.getByteFrequencyData(this.dataArray);

    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.strokeStyle = 'rgb(255, 255, 255)';
    this.canvasCtx.beginPath();

    const barWidth = (this.canvasWidth / this.bufferLength);
    let barHeight,
      x = 0,
      total = 0;

    for(let i = 0; i < this.bufferLength; i++) {
      barHeight = this.dataArray[i]*2;
      total += barHeight;

      this.canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
      this.canvasCtx.fillRect(x,this.canvasHeight-barHeight/2,barWidth,barHeight);

      x += barWidth;
    }
    if(total > 0 && !this.state.isReceivingAudio) {
      this.setState({isReceivingAudio: true});
    }

    this.rAF = requestAnimationFrame(this.renderMeter);
  }

  componentWillUnmount(){
    cancelAnimationFrame(this.rAF);

    if(this.canvasCtx){
      this.canvasCtx = null;
    }

    if(this.audioContext){
      this.audioContext.close();
      this.audioContext = null;
    }
    
    if(this.source){
      this.source.disconnect();
      this.source = null;
    }
    
    if(this.analyser){
      this.analyser.disconnect();
      this.analyser = null;
    }
    
    if(this.dataArray){
      this.dataArray = null;
    }
  }


  render() {
    const {
      isReceivingAudio
    } = this.state;
    return (
      <div className="volumemeter-component">
        { !isReceivingAudio &&
          <div className="no-audio-warning">
            <h4>NOT RECEIVING AUDIO</h4>
            <p>Please check that your microphone or webcam is plugged in and try refreshing the page.</p>
          </div>
        }
        <canvas ref="volumeMeterCanvas" ></canvas>
      </div>
    );
  }
}

VolumeMeter.displayName = 'VolumeMeter';
VolumeMeter.propTypes = {};
VolumeMeter.defaultProps = {};

export default VolumeMeter;
