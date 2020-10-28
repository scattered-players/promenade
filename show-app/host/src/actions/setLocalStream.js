import { SET_LOCAL_STREAM } from './const';

function action(stream) {
  return { type: SET_LOCAL_STREAM, stream };
}

export default action;
