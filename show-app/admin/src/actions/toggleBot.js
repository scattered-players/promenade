import React from 'react';
import config from 'config';

import { TOGGLE_BOT } from './const';

import showSnackbar from './showSnackbar';
function action(botId, isOn) {
  return [
    { type: TOGGLE_BOT, botId, isOn },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/bot/${botId}/toggle/${isOn}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar(
          <React.Fragment>
            Bot toggled!
          </React.Fragment>
        ));
      } catch(e) {
        dispatch(showSnackbar(`Error toggling bot: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
