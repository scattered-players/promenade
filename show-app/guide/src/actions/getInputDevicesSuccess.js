import { GET_INPUT_DEVICES_SUCCESS } from './const';

function action(devices, permissions) {
  return { type: GET_INPUT_DEVICES_SUCCESS, devices, permissions };
}

export default action;
