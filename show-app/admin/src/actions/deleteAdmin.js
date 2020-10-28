import config from 'config';

import { DELETE_ADMIN } from './const';

import showSnackbar from './showSnackbar';

function action(userId) {
  return [
    { type: DELETE_ADMIN, userId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/admin/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Admin deleted.'));
      } catch(e) {
        dispatch(showSnackbar(`Error deleting show: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
