import { DISMISS_SNACKBAR } from './const';

function action(parameter) {
  return { type: DISMISS_SNACKBAR, parameter };
}

export default action;
