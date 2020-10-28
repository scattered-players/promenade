import { CREATE_ADMIN_SUCCESS } from './const';

function action(parameter) {
  return { type: CREATE_ADMIN_SUCCESS, parameter };
}

export default action;
