import React from 'react';
import config from 'config';

import { CHANGE_SHOW_RUNNING } from './const';

import changeShowRunningFailure from './changeShowRunningFailure';
import changeShowRunningSuccess from './changeShowRunningSuccess';
import showSnackbar from './showSnackbar';

function action(showId, isRunning) {
  return [
    { type: CHANGE_SHOW_RUNNING, showId, isRunning },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/shows/run`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({showId, isRunning}),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(changeShowRunningSuccess());
        dispatch(showSnackbar(<React.Fragment>Show run status changed!</React.Fragment>));
      } catch(e) {
        dispatch(changeShowRunningFailure(e.statusText || e.message));
        dispatch(showSnackbar(`Error changing show run status: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;