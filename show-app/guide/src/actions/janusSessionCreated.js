import { JANUS_SESSION_CREATED } from './const';

function action(parameter) {
  return { type: JANUS_SESSION_CREATED, parameter };
}

module.exports = action;
