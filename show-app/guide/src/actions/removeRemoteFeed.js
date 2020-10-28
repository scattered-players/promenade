import { REMOVE_REMOTE_FEED } from './const';

function action(parameter) {
  return { type: REMOVE_REMOTE_FEED, parameter };
}

export default action;
