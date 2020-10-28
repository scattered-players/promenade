import { JOIN_VIDEO_ROOM } from './const';

function action(server, partyId, userId, audioMute, videoMute, localStream) {
  return { type: JOIN_VIDEO_ROOM, server, partyId, userId, audioMute, videoMute, localStream };
}

export default action;
