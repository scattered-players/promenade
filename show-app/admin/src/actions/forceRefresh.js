import { FORCE_REFRESH } from './const';

function action(parameter) {
  return { type: FORCE_REFRESH, parameter };
}

export default action;
