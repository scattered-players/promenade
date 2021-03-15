import config from 'config';

import { TOGGLE_MEGAPHONE } from './const';

import showSnackbar from './showSnackbar';

function action(userId, isMegaphone) {
  return [
    { type: TOGGLE_MEGAPHONE, userId, isMegaphone },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/guide/megaphone`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            isMegaphone
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Megaphone Toggled!'));
      } catch(e) {
        dispatch(showSnackbar(`Error toggling megaphone: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
