import { JOIN_ECHO_TEST } from './const';

function action(server, userId, audioMute, videoMute, localStream) {
  return { type: JOIN_ECHO_TEST, server, userId, audioMute, videoMute, localStream };
}

export default action;
