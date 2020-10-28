import React from 'react';
import config from 'config';

import { CHOOSE_ENDING } from './const';

import showSnackbar from './showSnackbar';

function action(partyId, endingUrl) {
  return [
    { type: CHOOSE_ENDING, partyId, endingUrl },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/parties/${partyId}/ending`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endingUrl
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar(<React.Fragment>Ending Chosen!</React.Fragment>));
      } catch(e) {
        dispatch(showSnackbar(`Error choosing ending: ${e.statusText || e.message}`));
      }
    }
  ]
}

export default action;