import { LEAVE_ECHO_TEST } from './const';

function action(parameter) {
  return { type: LEAVE_ECHO_TEST, parameter };
}

export default action;
