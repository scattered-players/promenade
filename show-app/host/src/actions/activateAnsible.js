import { ACTIVATE_ANSIBLE } from './const';

function action(parameter) {
  return { type: ACTIVATE_ANSIBLE, parameter };
}

module.exports = action;
