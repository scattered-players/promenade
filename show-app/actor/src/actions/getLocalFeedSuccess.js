import { GET_LOCAL_FEED_SUCCESS } from './const';

function action(stream, videoEl, mixerContext, audioSource, mixerOutput, mixerOutputStream, permissions) {
  return { type: GET_LOCAL_FEED_SUCCESS, stream, videoEl, mixerContext, audioSource, mixerOutput, mixerOutputStream, permissions };
}

export default action;
