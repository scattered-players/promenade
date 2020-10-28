import { CREATE_ADMIN_FAILURE } from './const';

function action(parameter) {
  return { type: CREATE_ADMIN_FAILURE, parameter };
}

export default action;
