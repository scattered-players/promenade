import React from 'react';
import { Button } from '@material-ui/core';
import config from 'config';

import { CREATE_ACTOR } from './const';

import createActorFailure from './createActorFailure';
import createActorSuccess from './createActorSuccess';
import showSnackbar from './showSnackbar';
function action(email, username) {
  return [
    { type: CREATE_ACTOR, email, username },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/actor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, username }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        let result = await response.json();

        dispatch(createActorSuccess());
        dispatch(showSnackbar(
          <React.Fragment>
            Actor created!
            <Button onClick={() => navigator.clipboard.writeText(`${config.ACTOR_URL}?token=${result.token}`)}>Click here to copy token</Button>
          </React.Fragment>
        ));
      } catch(e) {
        dispatch(createActorFailure(e.statusText || e.message));
        dispatch(showSnackbar(`Error creating actor: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
