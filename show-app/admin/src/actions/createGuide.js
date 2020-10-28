import React from 'react';
import { Button } from '@material-ui/core';
import config from 'config';

import { CREATE_GUIDE } from './const';

import showSnackbar from './showSnackbar';

function action(email, username, characterName) {
  return [
    { type: CREATE_GUIDE, email, username, characterName },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/guide`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, username, characterName }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        let result = await response.json();
        dispatch(showSnackbar(
          <React.Fragment>
            Guide created!
            <Button onClick={() => navigator.clipboard.writeText(`${config.GUIDE_URL}?token=${result.token}`)}>Click here to copy token</Button>
          </React.Fragment>
        ));
      } catch(e) {
        dispatch(showSnackbar(`Error creating guide: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
