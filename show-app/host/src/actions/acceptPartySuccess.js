import { ACCEPT_PARTY_SUCCESS } from './const';

function action(parameter) {
  return { type: ACCEPT_PARTY_SUCCESS, parameter };
}

export default action;
