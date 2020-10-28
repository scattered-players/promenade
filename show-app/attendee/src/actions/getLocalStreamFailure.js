import { GET_LOCAL_STREAM_FAILURE } from './const';

function action(error) {
  return { type: GET_LOCAL_STREAM_FAILURE, error };
}

export default action;
