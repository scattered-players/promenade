import { LEAVE_VIDEO_ROOM_FAILURE } from './const';

function action(parameter) {
  return { type: LEAVE_VIDEO_ROOM_FAILURE, parameter };
}

export default action;
