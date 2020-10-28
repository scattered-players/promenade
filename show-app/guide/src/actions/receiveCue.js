import { RECEIVE_CUE } from './const';

function action(parameter) {
  return { type: RECEIVE_CUE, parameter };
}

module.exports = action;
