import config from 'config';

import { SEND_ENDING_ALERT } from './const';

import showSnackbar from './showSnackbar';

function action(showId, hasEndingAlert) {
  return [
    { type: SEND_ENDING_ALERT, showId, hasEndingAlert },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/shows/alerts`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            showId,
            hasIntroAlert: true,
            hasEndingAlert
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Ending Alert sent!'));
      } catch(e) {
        dispatch(showSnackbar(`Error setting ending alert: ${e.statusText || e.message}`));
      }
    }
  ];
}

module.exports = action;
