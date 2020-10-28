import { PREVIEW_PARTY } from './const';

function action(partyId) {
  return { type: PREVIEW_PARTY, partyId };
}

export default action;
