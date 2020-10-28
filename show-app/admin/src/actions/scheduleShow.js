import React from 'react';
import config from 'config';

import { SCHEDULE_SHOW } from './const';

import scheduleShowFailure from './scheduleShowFailure';
import scheduleShowSuccess from './scheduleShowSuccess';
import showSnackbar from './showSnackbar';

function action(date, numParties=6) {
  return [
    { type: SCHEDULE_SHOW, date, numParties },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/shows`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({date, numParties}),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(scheduleShowSuccess());
        dispatch(showSnackbar(<React.Fragment>Show scheduled!</React.Fragment>));
      } catch(e) {
        dispatch(scheduleShowFailure(e.statusText || e.message));
        dispatch(showSnackbar(`Error scheduling show: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
