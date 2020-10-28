import { SEND_TO_OUTRO_VIDEO } from './const';

function action(parameter) {
  return { type: SEND_TO_OUTRO_VIDEO, parameter };
}

module.exports = action;
