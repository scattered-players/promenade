import config from 'config';

import { SEND_CHAT_MESSAGE } from './const';

import showSnackbar from './showSnackbar';

function action(partyId, message) {
  return [
    { type: SEND_CHAT_MESSAGE, partyId, message },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/parties/${partyId}/sendMessage`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: message
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Message Sent!'));
      } catch(e) {
        dispatch(showSnackbar(`Error sending message: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;