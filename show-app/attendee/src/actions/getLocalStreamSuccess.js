import { GET_LOCAL_STREAM_SUCCESS } from './const';

function action(stream) {
  return { type: GET_LOCAL_STREAM_SUCCESS, stream };
}

export default action;
