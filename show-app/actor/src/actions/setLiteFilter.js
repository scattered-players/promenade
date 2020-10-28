import React from 'react';
import config from 'config';

import { SET_LITE_FILTER } from './const';

import showSnackbar from './showSnackbar';

function action(placeId, currentFilter) {
  return [
    { type: SET_LITE_FILTER, placeId, currentFilter },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/place/filter`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            placeId, currentFilter
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }
  
        dispatch(showSnackbar('Filter changed!'));
      } catch(e) {
        dispatch(showSnackbar(`Error setting filter: ${e.statusText || e.message}`));
      }
    }
  ];
}

module.exports = action;
