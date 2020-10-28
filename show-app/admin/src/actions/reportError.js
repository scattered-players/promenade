import { REPORT_ERROR } from './const';

function action(body) {
  return { type: REPORT_body, body };
}

export default action;
