import config from 'config';

import { SET_READY_FLAG } from './const';

import showSnackbar from './showSnackbar';

function action(placeId, isAvailable) {
  return [
    { type: SET_READY_FLAG, placeId, isAvailable },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/place/available`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            placeId, isAvailable
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }
  
        dispatch(showSnackbar('Availability status changed!'));
      } catch(e) {
        dispatch(showSnackbar(`Error setting availability status: ${e.statusText || e.message}`));
      }
    }
  ];
}

module.exports = action;
