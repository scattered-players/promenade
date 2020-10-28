import { RECEIVE_SHOW_STATUS } from './const';

function action(parameter) {
  return { type: RECEIVE_SHOW_STATUS, parameter };
}

export default action;
