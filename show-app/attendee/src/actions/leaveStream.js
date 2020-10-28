import { LEAVE_STREAM } from './const';

function action(parameter) {
  return { type: LEAVE_STREAM, parameter };
}

export default action;
