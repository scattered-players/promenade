import { SET_STREAMING_STREAM } from './const';

function action(parameter) {
  return { type: SET_STREAMING_STREAM, parameter };
}

export default action;
