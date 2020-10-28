import { TOGGLE_MONITOR } from './const';

function action(isMonitorOn) {
  return { type: TOGGLE_MONITOR, isMonitorOn };
}

export default action;
