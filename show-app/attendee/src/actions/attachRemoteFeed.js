import { ATTACH_REMOTE_FEED } from './const';

function action(parameter) {
  return { type: ATTACH_REMOTE_FEED, parameter };
}

export default action;
