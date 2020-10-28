import { RECEIVE_ACTOR_FEED } from './const';

function action(parameter) {
  return { type: RECEIVE_ACTOR_FEED, parameter };
}

export default action;
