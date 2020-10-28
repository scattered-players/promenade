import config from 'config';

import { DELETE_GUIDE } from './const';

import showSnackbar from './showSnackbar';

function action(userId) {
  return [
    { type: DELETE_GUIDE, userId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/guide/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Guide deleted.'));
      } catch(e) {
        dispatch(showSnackbar(`Error deleting guide: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
