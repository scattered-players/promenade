import { JOIN_VIDEO_ROOM_FAILURE } from './const';

function action(parameter) {
  return { type: JOIN_VIDEO_ROOM_FAILURE, parameter };
}

export default action;
