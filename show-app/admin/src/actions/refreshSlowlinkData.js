import { REFRESH_SLOWLINK_DATA } from './const';

function action(parameter) {
  return { type: REFRESH_SLOWLINK_DATA, parameter };
}

export default action;
