import { TOGGLE_NOTIFICATIONS } from './const';

function action(wantsNotifications) {
  return { type: TOGGLE_NOTIFICATIONS, wantsNotifications };
}

export default action;
