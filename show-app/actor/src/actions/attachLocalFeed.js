import { ATTACH_LOCAL_FEED } from './const';

function action(parameter) {
  return { type: ATTACH_LOCAL_FEED, parameter };
}

export default action;
