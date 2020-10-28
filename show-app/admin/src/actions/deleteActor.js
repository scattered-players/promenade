import config from 'config';

import { DELETE_ACTOR } from './const';

import showSnackbar from './showSnackbar';

function action(userId) {
  return [
    { type: DELETE_ACTOR, userId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/actor/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Actor deleted.'));
      } catch(e) {
        dispatch(showSnackbar(`Error deleting actor: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
