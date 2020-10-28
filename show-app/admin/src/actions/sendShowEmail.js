import config from 'config';

import { SEND_SHOW_EMAIL } from './const';

import showSnackbar from './showSnackbar';

function action(showId) {
  return [
    { type: SEND_SHOW_EMAIL, showId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/shows/loginEmail/${showId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }
        let results = await response.json();
        let errors = results.filter(attempt => attempt.result === 'ERROR');
        if(errors.length) {
          throw new Error(`Failed to send emails to ${ errors.map(attempt => attempt.to)}`);
        }

        dispatch(showSnackbar('Login emails sent!'));
      } catch(e) {
        dispatch(showSnackbar(`Error sending login emails: ${e.statusText || e.message}`));
      }
    }
  ];
}

module.exports = action;
