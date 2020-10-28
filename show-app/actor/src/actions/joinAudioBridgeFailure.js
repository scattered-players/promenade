import { JOIN_AUDIO_BRIDGE_FAILURE } from './const';

function action(parameter) {
  return { type: JOIN_AUDIO_BRIDGE_FAILURE, parameter };
}

export default action;
