import { RECEIVE_REMOTE_FEED } from './const';

function action(parameter) {
  return { type: RECEIVE_REMOTE_FEED, parameter };
}

export default action;
