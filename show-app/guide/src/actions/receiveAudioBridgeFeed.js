import { RECEIVE_AUDIO_BRIDGE_FEED } from './const';

function action(parameter) {
  return { type: RECEIVE_AUDIO_BRIDGE_FEED, parameter };
}

export default action;
