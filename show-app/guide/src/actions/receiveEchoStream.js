import { RECEIVE_ECHO_STREAM } from './const';

function action(parameter) {
  return { type: RECEIVE_ECHO_STREAM, parameter };
}

export default action;
