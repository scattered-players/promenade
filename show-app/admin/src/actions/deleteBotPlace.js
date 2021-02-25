import React from 'react';
import config from 'config';

import { DELETE_BOT_PLACE } from './const';

import showSnackbar from './showSnackbar';

function action(botId, placeId) {
  return [
    { type: DELETE_BOT_PLACE, botId, placeId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/botplace`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ botId, placeId }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar(
          <React.Fragment>
            Bot Place deleted!
          </React.Fragment>
        ));
      } catch(e) {
        dispatch(showSnackbar(`Error deleting bot place: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
