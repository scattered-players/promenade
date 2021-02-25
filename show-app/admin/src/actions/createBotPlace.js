import React from 'react';
import config from 'config';

import { CREATE_BOT_PLACE } from './const';

import showSnackbar from './showSnackbar';

function action(botId, characterName, placeName, flavorText, assetKey, botURL, botTime) {
  return [
    { type: CREATE_BOT_PLACE, botId, characterName, placeName, flavorText, assetKey, botURL, botTime },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/botplace`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ botId, characterName, placeName, flavorText, assetKey, botURL, botTime }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar(
          <React.Fragment>
            Bot Place created!
          </React.Fragment>
        ));
      } catch(e) {
        dispatch(showSnackbar(`Error creating bot place: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
