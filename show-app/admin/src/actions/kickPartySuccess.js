import { KICK_PARTY_SUCCESS } from './const';

function action(parameter) {
  return { type: KICK_PARTY_SUCCESS, parameter };
}

export default action;
