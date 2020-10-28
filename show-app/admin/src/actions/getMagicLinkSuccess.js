import { GET_MAGIC_LINK_SUCCESS } from './const';

function action(parameter) {
  return { type: GET_MAGIC_LINK_SUCCESS, parameter };
}

export default action;
