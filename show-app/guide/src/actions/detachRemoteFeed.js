import { DETACH_REMOTE_FEED } from './const';

function action(parameter) {
  return { type: DETACH_REMOTE_FEED, parameter };
}

export default action;
