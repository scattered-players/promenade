import { JOIN_VIDEO_ROOM } from './const';

function action(server, partyId, placeId, audioMute, videoMute, localStream) {
  return { type: JOIN_VIDEO_ROOM, server, partyId, placeId, audioMute, videoMute, localStream };
}

export default action;
