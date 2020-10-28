import React from 'react';
import config from 'config';

import { QUEUE_AT_PLACE } from './const';

import queueAtPlaceFailure from './queueAtPlaceFailure';
import queueAtPlaceSuccess from './queueAtPlaceSuccess';
import showSnackbar from './showSnackbar';

function action(partyId, placeId) {
  return [
    { type: QUEUE_AT_PLACE, partyId, placeId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/navigation/queue`, {
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

        dispatch(queueAtPlaceSuccess());
        dispatch(showSnackbar(<React.Fragment>Place Queued!</React.Fragment>));
      } catch(e) {
        dispatch(queueAtPlaceFailure(e.statusText || e.message));
        dispatch(showSnackbar(`Error selecting place: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
