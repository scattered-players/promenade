import React from 'react';
import config from 'config';

import { CHANGE_USERNAME } from './const';

import showSnackbar from './showSnackbar';

function action(userId, username) {
  return [
    { type: CHANGE_USERNAME, userId, username },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/username`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId, username
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar(<React.Fragment>Username Changed!</React.Fragment>));
      } catch(e) {
        dispatch(showSnackbar(`Error changing username: ${e.statusText || e.message}`));
      }
    }
  ]
}

export default action;
