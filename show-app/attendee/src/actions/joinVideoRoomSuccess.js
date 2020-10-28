import { JOIN_VIDEO_ROOM_SUCCESS } from './const';

function action(parameter) {
  return { type: JOIN_VIDEO_ROOM_SUCCESS, parameter };
}

export default action;
