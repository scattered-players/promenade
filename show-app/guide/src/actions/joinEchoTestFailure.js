import { JOIN_ECHO_TEST_FAILURE } from './const';

function action(parameter) {
  return { type: JOIN_ECHO_TEST_FAILURE, parameter };
}

export default action;
