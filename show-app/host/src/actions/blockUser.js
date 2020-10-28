import React from 'react';
import config from 'config';

import { BLOCK_USER } from './const';

import showSnackbar from './showSnackbar';

function action(userId) {
  return [
    { type: BLOCK_USER, userId },
  async dispatch => {
    try{
      let response = await fetch(`${ config.SERVICE_HOST }/users/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId
        }),
        credentials: 'include'
      });
      if (!response.ok) {
        throw response;
      }
      dispatch(showSnackbar(<React.Fragment>Blocked!</React.Fragment>));
    } catch(e) {
      dispatch(showSnackbar(`Error blocking user: ${e.statusText || e.message}`));
    }
  }
];
}

export default action;
