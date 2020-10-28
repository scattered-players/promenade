import { CHANGE_VIDEO_ROOM_PARTICIPANTS } from './const';

function action(parameter) {
  return { type: CHANGE_VIDEO_ROOM_PARTICIPANTS, parameter };
}

export default action;
