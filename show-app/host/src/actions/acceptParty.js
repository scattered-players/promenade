import React from 'react';
import config from 'config';

import { ACCEPT_PARTY } from './const';

import acceptPartyFailure from './acceptPartyFailure';
import acceptPartySuccess from './acceptPartySuccess';
import showSnackbar from './showSnackbar';

function action(partyId, placeId) {
  return [
    { type: ACCEPT_PARTY, partyId, placeId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/navigation/accept`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            partyId,
            placeId
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(acceptPartySuccess());
        dispatch(showSnackbar(<React.Fragment>Party Accepted!</React.Fragment>));
      } catch(e) {
        dispatch(acceptPartyFailure(e.statusText || e.message));
        dispatch(showSnackbar(`Error accepting party: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
