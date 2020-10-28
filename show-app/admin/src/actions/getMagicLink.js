import React from 'react';
import { Button } from '@material-ui/core';
import config from 'config';

import { GET_MAGIC_LINK } from './const';

import getMagicLinkFailure from './getMagicLinkFailure';
import getMagicLinkSuccess from './getMagicLinkSuccess';
import showSnackbar from './showSnackbar';

function action(userId) {
  return [
    { type: GET_MAGIC_LINK, userId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/magiclink/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        let result = await response.json();
        navigator.clipboard.writeText(`${config[result.kind.toUpperCase() + '_URL']}?token=${result.token}`)

        dispatch(getMagicLinkSuccess());
        dispatch(showSnackbar(
          <React.Fragment>
            Copied Magic Link!
            {/* <Button onClick={() => navigator.clipboard.writeText(`${config[result.kind.toUpperCase() + '_URL']}?token=${result.token}`)}>Click here to copy token</Button> */}
          </React.Fragment>
        ));
      } catch(e) {
        dispatch(getMagicLinkFailure(e.statusText || e.message));
        dispatch(showSnackbar(`Error getting magic link: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
