import { SHOW_SNACKBAR } from './const';

function action(text, timeout=5000) {
  return { type: SHOW_SNACKBAR, text, timeout };
}

export default action;
