import React from 'react';
import config from 'config';

import { CHANGE_SHOW_STATUS } from './const';

import changeShowStatusFailure from './changeShowStatusFailure';
import changeShowStatusSuccess from './changeShowStatusSuccess';
import showSnackbar from './showSnackbar';

function action(showId, state) {
  return [
    { type: CHANGE_SHOW_STATUS, showId, state },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/shows/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({showId, state}),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(changeShowStatusSuccess());
        dispatch(showSnackbar(<React.Fragment>Show status changed!</React.Fragment>));
      } catch(e) {
        dispatch(changeShowStatusFailure(e.statusText || e.message));
        dispatch(showSnackbar(`Error changing show status: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
