import { SCHEDULE_SHOW_SUCCESS } from './const';

function action(parameter) {
  return { type: SCHEDULE_SHOW_SUCCESS, parameter };
}

export default action;
