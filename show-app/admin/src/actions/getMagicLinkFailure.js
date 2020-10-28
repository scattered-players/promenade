import { GET_MAGIC_LINK_FAILURE } from './const';

function action(parameter) {
  return { type: GET_MAGIC_LINK_FAILURE, parameter };
}

export default action;
