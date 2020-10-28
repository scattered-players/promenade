import { JOIN_AUDIO_BRIDGE_SUCCESS } from './const';

function action(parameter) {
  return { type: JOIN_AUDIO_BRIDGE_SUCCESS, parameter };
}

export default action;
