import { LOGIN_FAILURE } from './const';

function action(error) {
  return { type: LOGIN_FAILURE, error };
}

export default action;
