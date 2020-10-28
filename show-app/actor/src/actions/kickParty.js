import React from 'react';
import config from 'config';

import { KICK_PARTY } from './const';

import kickPartyFailure from './kickPartyFailure';
import kickPartySuccess from './kickPartySuccess';
import showSnackbar from './showSnackbar';

function action(partyId, placeId) {
  return [
    { type: KICK_PARTY, partyId, placeId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/navigation/kick`, {
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

        dispatch(kickPartySuccess());
        dispatch(showSnackbar(<React.Fragment>Party kicked!</React.Fragment>));
      } catch(e) {
        dispatch(kickPartyFailure(e.statusText || e.message));
        dispatch(showSnackbar(`Error kicking party: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
