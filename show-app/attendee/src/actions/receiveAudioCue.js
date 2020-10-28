import { RECEIVE_AUDIO_CUE } from './const';

function action(audioPath) {
  return { type: RECEIVE_AUDIO_CUE, audioPath };
}

module.exports = action;
