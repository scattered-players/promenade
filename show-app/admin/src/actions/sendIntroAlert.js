import config from 'config';

import { SEND_INTRO_ALERT } from './const';

import showSnackbar from './showSnackbar';

function action(showId, hasIntroAlert) {
  return [
    { type: SEND_INTRO_ALERT, showId, hasIntroAlert },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/shows/alerts`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            showId,
            hasIntroAlert,
            hasEndingAlert: false
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Intro Alert sent!'));
      } catch(e) {
        dispatch(showSnackbar(`Error setting intro alert: ${e.statusText || e.message}`));
      }
    }
  ];
}

module.exports = action;
