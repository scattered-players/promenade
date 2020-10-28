import config from 'config';

import { CENCEL_ALERTS } from './const';

import showSnackbar from './showSnackbar';

function action(showId) {
  return [
    { type: CENCEL_ALERTS, showId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/shows/alerts`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            showId,
            hasIntroAlert: false,
            hasEndingAlert: false
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Alerts cancelled!'));
      } catch(e) {
        dispatch(showSnackbar(`Error cancelling alert: ${e.statusText || e.message}`));
      }
    }
  ];
}

module.exports = action;
