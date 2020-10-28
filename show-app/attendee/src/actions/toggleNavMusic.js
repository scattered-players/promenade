import { TOGGLE_NAV_MUSIC } from './const';

function action(muteNavMusic) {
  return { type: TOGGLE_NAV_MUSIC, muteNavMusic };
}

export default action;
