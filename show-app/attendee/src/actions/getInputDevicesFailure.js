import { GET_INPUT_DEVICES_FAILURE } from './const';

function action(error) {
  return { type: GET_INPUT_DEVICES_FAILURE, error };
}

export default action;
