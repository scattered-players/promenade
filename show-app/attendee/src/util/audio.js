import {
  reportError
} from '../actions';

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new window.AudioContext();
let audioCache = {};

async function getAudioBuffer(audioPath){
  if(!audioCache[audioPath]) {
    let response = await fetch(audioPath);
    let arrayBuffer = await response.arrayBuffer();
    let audioBuffer = await new Promise((resolve, reject) => audioContext.decodeAudioData(arrayBuffer, resolve, reject));
    audioCache[audioPath] = audioBuffer;
  }
  return audioCache[audioPath];
}

export default async function playAudio(audioPath) {
  if(audioPath && audioPath.length) {
    try {
      let cueSource = audioContext.createBufferSource();
      cueSource.buffer = await getAudioBuffer(audioPath);
      cueSource.connect(audioContext.destination);
      cueSource.start();
    } catch(e){
      console.error('ERROR PLAYING AUDIO CUE:', e);
      reportError({
        type:'AUTOPLAY_FAIL',
        message: `Failed to play audio cue: ${e.message || e}`
      })();
    }
  }
}