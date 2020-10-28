import React from 'react';
import config from 'config';

import { SELECT_PLACE } from './const';

import selectPlaceFailure from './selectPlaceFailure';
import selectPlaceSuccess from './selectPlaceSuccess';
import showSnackbar from './showSnackbar';

function action(partyId, placeId) {
  return [
    { type: SELECT_PLACE, partyId, placeId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/navigation/select`, {
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

        dispatch(selectPlaceSuccess());
        dispatch(showSnackbar(<React.Fragment>Place Selected!</React.Fragment>));
      } catch(e) {
        dispatch(selectPlaceFailure(e.statusText || e.message));
        dispatch(showSnackbar(`Error selecting place: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
