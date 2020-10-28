import config from 'config';

import { SEND_CUE } from './const';

import showSnackbar from './showSnackbar';

function action(cue) {
  return [
    { type: SEND_CUE, cue },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/shows/cue`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cue),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Cue sent!'));
      } catch(e) {
        dispatch(showSnackbar(`Error sending cue: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
