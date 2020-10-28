import { QUEUE_AT_PLACE_FAILURE } from './const';

function action(parameter) {
  return { type: QUEUE_AT_PLACE_FAILURE, parameter };
}

export default action;
