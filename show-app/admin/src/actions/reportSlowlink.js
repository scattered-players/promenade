import { REPORT_SLOWLINK } from './const';

function action(parameter) {
  return { type: REPORT_SLOWLINK, parameter };
}

export default action;
