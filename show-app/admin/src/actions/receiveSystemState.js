import { RECEIVE_SYSTEM_STATE } from './const';

function action(parameter) {
  return { type: RECEIVE_SYSTEM_STATE, parameter };
}

export default action;
