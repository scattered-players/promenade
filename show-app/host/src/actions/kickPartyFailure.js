import { KICK_PARTY_FAILURE } from './const';

function action(parameter) {
  return { type: KICK_PARTY_FAILURE, parameter };
}

export default action;
