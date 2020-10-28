import { REPORT_LOGIN } from './const';

function action(body) {
  return { type: REPORT_LOGIN, body };
}

export default action;
