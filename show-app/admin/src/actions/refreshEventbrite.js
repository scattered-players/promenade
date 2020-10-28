import config from 'config';

import { REFRESH_EVENTBRITE } from './const';
import showSnackbar from './showSnackbar';

function action() {
  return [
    { type: REFRESH_EVENTBRITE },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/sync/eventbrite`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Eventbrite refreshed!'));
      } catch(e) {
        dispatch(showSnackbar(`Error refreshing eventbrite: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
