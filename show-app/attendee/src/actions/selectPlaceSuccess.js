import { SELECT_PLACE_SUCCESS } from './const';

function action(parameter) {
  return { type: SELECT_PLACE_SUCCESS, parameter };
}

export default action;
