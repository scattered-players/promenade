import { TOGGLE_NERDINESS } from './const';

function action(isNerdy) {
  return { type: TOGGLE_NERDINESS, isNerdy };
}

export default action;
