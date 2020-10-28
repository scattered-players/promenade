import { STREAM_FAILURE } from './const';

function action(parameter) {
  return { type: STREAM_FAILURE, parameter };
}

export default action;
