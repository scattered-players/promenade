import config from 'config';

import { DELETE_SHOW } from './const';

import showSnackbar from './showSnackbar';

function action(showId) {
  return [
    { type: DELETE_SHOW, showId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/shows/${showId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Show deleted.'));
      } catch(e) {
        dispatch(showSnackbar(`Error deleting show: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
