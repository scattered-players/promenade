import { GET_LOCAL_FEED_FAILURE } from './const';

function action(parameter) {
  return { type: GET_LOCAL_FEED_FAILURE, parameter };
}

export default action;
