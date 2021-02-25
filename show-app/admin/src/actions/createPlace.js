import React from 'react';
import config from 'config';

import { CREATE_PLACE } from './const';

import showSnackbar from './showSnackbar';

function action(actorId, characterName, placeName, flavorText, audioPath, assetKey, phase) {
  return [
    { type: CREATE_PLACE, actorId, characterName, placeName, flavorText, audioPath, assetKey, phase },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/place`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ actorId, characterName, placeName, flavorText, audioPath, assetKey, phase }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar(
          <React.Fragment>
            Place created!
          </React.Fragment>
        ));
      } catch(e) {
        dispatch(showSnackbar(`Error creating place: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
