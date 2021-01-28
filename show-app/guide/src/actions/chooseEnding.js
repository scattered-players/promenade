import React from 'react';
import config from 'config';

import { CHOOSE_ENDING } from './const';

import showSnackbar from './showSnackbar';

function action(partyId, phaseId, videoChoice) {
  return [
    { type: CHOOSE_ENDING, partyId, phaseId, videoChoice },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/parties/${partyId}/videochoice`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phaseId, videoChoice
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar(<React.Fragment>Video Chosen!</React.Fragment>));
      } catch(e) {
        dispatch(showSnackbar(`Error choosing video: ${e.statusText || e.message}`));
      }
    }
  ]
}

export default action;