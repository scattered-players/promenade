import React from 'react';
import config from 'config';

import { CREATE_BOT } from './const';

import showSnackbar from './showSnackbar';
function action(username) {
  return [
    { type: CREATE_BOT, username },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/bot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar(
          <React.Fragment>
            Bot created!
          </React.Fragment>
        ));
      } catch(e) {
        dispatch(showSnackbar(`Error creating bot: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
