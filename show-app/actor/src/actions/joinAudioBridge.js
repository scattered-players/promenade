import { JOIN_AUDIO_BRIDGE } from './const';

function action(server, showId, userId) {
  return { type: JOIN_AUDIO_BRIDGE, server, showId, userId };
}

export default action;
