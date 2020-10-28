import { SELECT_PLACE_FAILURE } from './const';

function action(parameter) {
  return { type: SELECT_PLACE_FAILURE, parameter };
}

export default action;
