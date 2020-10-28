import config from 'config';

import { FORCE_REFRESH_USER } from './const';

import showSnackbar from './showSnackbar';

function action(userId) {
  return [
    { type: FORCE_REFRESH_USER, userId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/forceRefresh/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('User refreshed.'));
      } catch(e) {
        dispatch(showSnackbar(`Error refreshing user: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
