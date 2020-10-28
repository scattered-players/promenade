import { REMOVE_ACTOR_FEED } from './const';

function action(parameter) {
  return { type: REMOVE_ACTOR_FEED, parameter };
}

export default action;
