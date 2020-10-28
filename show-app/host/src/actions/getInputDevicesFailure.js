import { GET_INPUT_DEVICES_FAILURE } from './const';

function action(parameter) {
  return { type: GET_INPUT_DEVICES_FAILURE, parameter };
}

export default action;
