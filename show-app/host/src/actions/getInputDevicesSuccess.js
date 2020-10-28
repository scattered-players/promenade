import { GET_INPUT_DEVICES_SUCCESS } from './const';

function action(devices) {
  return { type: GET_INPUT_DEVICES_SUCCESS, devices };
}

export default action;
