import config from 'config';

import { SET_CHARACTER_NAME } from './const';

import showSnackbar from './showSnackbar';

function action(userId, characterName) {
  return [
    { type: SET_CHARACTER_NAME, userId, characterName },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/charactername`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId, characterName
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }
  
        dispatch(showSnackbar('Character Name Changed!'));
      } catch(e) {
        dispatch(showSnackbar(`Error changing character name: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
