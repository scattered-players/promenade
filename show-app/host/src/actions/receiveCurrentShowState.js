import { RECEIVE_CURRENT_SHOW_STATE } from './const';

function action(body) {
  return { type: RECEIVE_CURRENT_SHOW_STATE, body };
}

export default action;
