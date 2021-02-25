import config from 'config';

import { DELETE_BOT } from './const';

import showSnackbar from './showSnackbar';

function action(botId) {
  return [
    { type: DELETE_BOT, botId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/bot/${botId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Bot deleted.'));
      } catch(e) {
        dispatch(showSnackbar(`Error deleting bot: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
