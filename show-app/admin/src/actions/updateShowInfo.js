import config from 'config';

import { UPDATE_SHOW_INFO } from './const';
import showSnackbar from './showSnackbar';

function action(showId, date, isEventbrite) {
  return [
    { type: UPDATE_SHOW_INFO, showId, date, isEventbrite },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/shows/info`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ showId, date, isEventbrite }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Show updated!'));
      } catch(e) {
        dispatch(showSnackbar(`Error updating show: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
