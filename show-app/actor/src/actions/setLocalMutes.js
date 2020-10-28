import { SET_LOCAL_MUTES } from './const';

function action(audioMute, videoMute) {
  return { type: SET_LOCAL_MUTES, audioMute, videoMute };
}

export default action;
