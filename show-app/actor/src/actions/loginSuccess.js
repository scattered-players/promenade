import { LOGIN_SUCCESS } from './const';

function action(user) {
  return { type: LOGIN_SUCCESS, user };
}

export default action;
