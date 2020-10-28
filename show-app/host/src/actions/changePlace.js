import React from 'react';
import config from 'config';

import { CHANGE_PLACE } from './const';

import showSnackbar from './showSnackbar';

function action(placeId, placeName, characterName, flavorText, audioPath, assetKey) {
  return { type: CHANGE_PLACE, placeId, placeName, characterName, flavorText, audioPath, assetKey },
  async dispatch => {
    try{
      let response = await fetch(`${ config.SERVICE_HOST }/users/place`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          placeId, placeName, characterName, flavorText, audioPath, assetKey
        }),
        credentials: 'include'
      });
      if (!response.ok) {
        throw response;
      }

      dispatch(showSnackbar(<React.Fragment>Place Changed!</React.Fragment>));
    } catch(e) {
      dispatch(showSnackbar(`Error changing place: ${e.statusText || e.message}`));
    }
  }
}

export default action;
