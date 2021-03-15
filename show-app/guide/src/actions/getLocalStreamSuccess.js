import { GET_LOCAL_STREAM_SUCCESS } from './const';

function action(stream, outputStream, mixerContext, audioSource, mixerOutput, mixerOutputStream, permissions) {
  return { type: GET_LOCAL_STREAM_SUCCESS, stream, outputStream, mixerContext, audioSource, mixerOutput, mixerOutputStream, permissions };
}

export default action;
