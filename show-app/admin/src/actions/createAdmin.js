import React from 'react';
import { Button } from '@material-ui/core';
import config from 'config';

import { CREATE_ADMIN } from './const';

import createAdminFailure from './createAdminFailure';
import createAdminSuccess from './createAdminSuccess';
import showSnackbar from './showSnackbar';

function action(email) {
  return [
    { type: CREATE_ADMIN, email },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/admin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email, sendEmail: true }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        let result = await response.json();

        dispatch(createAdminSuccess());
        dispatch(showSnackbar(
          <React.Fragment>
            Admin created!
            <Button onClick={() => navigator.clipboard.writeText(`${config.ADMIN_URL}?token=${result.token}`)}>Click here to copy token</Button>
          </React.Fragment>
        ));
      } catch(e) {
        dispatch(createAdminFailure(e.statusText || e.message));
        dispatch(showSnackbar(`Error creating admin: ${e.statusText || e.message}`));
      }
    }
  ];
}


export default action;
