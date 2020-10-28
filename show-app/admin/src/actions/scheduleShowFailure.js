import { SCHEDULE_SHOW_FAILURE } from './const';

function action(error) {
  return { type: SCHEDULE_SHOW_FAILURE, error };
}

export default action;
