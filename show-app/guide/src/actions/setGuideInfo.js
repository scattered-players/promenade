import config from 'config';

import { SET_GUIDE_INFO } from './const';

import showSnackbar from './showSnackbar';

function action(userId, characterName, audioPath) {
  return [
    { type: SET_GUIDE_INFO, userId, characterName, audioPath },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/guide`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId, characterName, audioPath
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }
  
        dispatch(showSnackbar('Guide Info Changed!'));
      } catch(e) {
        dispatch(showSnackbar(`Error changing guide info: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
