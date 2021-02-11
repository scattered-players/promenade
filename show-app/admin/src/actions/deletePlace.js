import React from 'react';
import config from 'config';

import { DELETE_PLACE } from './const';

import showSnackbar from './showSnackbar';

function action(actorId, placeId) {
  return [
    { type: DELETE_PLACE, actorId, placeId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/place`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ actorId, placeId }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar(
          <React.Fragment>
            Place deleted!
          </React.Fragment>
        ));
      } catch(e) {
        dispatch(showSnackbar(`Error deleting place: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
