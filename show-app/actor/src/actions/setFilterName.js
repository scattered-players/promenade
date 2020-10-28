import { SET_FILTER_NAME } from './const';

function action(filter) {
  return { type: SET_FILTER_NAME, filter };
}

export default action;
