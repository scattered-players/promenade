import { JOIN_ECHO_TEST_SUCCESS } from './const';

function action(echoTest, stream) {
  return { type: JOIN_ECHO_TEST_SUCCESS, echoTest, stream };
}

export default action;
