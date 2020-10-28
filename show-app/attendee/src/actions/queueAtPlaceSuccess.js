import { QUEUE_AT_PLACE_SUCCESS } from './const';

function action(parameter) {
  return { type: QUEUE_AT_PLACE_SUCCESS, parameter };
}

export default action;
