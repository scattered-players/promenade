import config from 'config';

import { SET_LOCAL_MUTES } from './const';

import showSnackbar from './showSnackbar';

function action(userId, isAudioMuted, isVideoMuted) {
  return [
    { type: SET_LOCAL_MUTES, isAudioMuted, isVideoMuted },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/mutes`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            isAudioMuted,
            isVideoMuted
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }
      } catch(e) {
        dispatch(showSnackbar(`Error setting mutes: ${e.statusText || e.message}`));
      }
    }
  ]
}

export default action;
