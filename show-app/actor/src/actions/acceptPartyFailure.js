import { ACCEPT_PARTY_FAILURE } from './const';

function action(parameter) {
  return { type: ACCEPT_PARTY_FAILURE, parameter };
}

export default action;
