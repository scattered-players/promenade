import { JOIN_STREAM } from './const';

function action(server, showId) {
  return { type: JOIN_STREAM, server, showId };
}

export default action;
