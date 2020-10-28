import { GET_LOCAL_FEED_SUCCESS } from './const';

function action(stream, videoEl, mixerContext, audioSource, mixerOutput, mixerOutputStream) {
  return { type: GET_LOCAL_FEED_SUCCESS, stream, videoEl, mixerContext, audioSource, mixerOutput, mixerOutputStream };
}

export default action;
