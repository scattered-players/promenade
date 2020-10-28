import config from 'config';

import { SEND_AUDIO_CUE } from './const';

import showSnackbar from './showSnackbar';

function action(audioPath) {
  return [
    { type: SEND_AUDIO_CUE, audioPath },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/shows/audiocue`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audioPath
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Audio Cue sent!'));
      } catch(e) {
        dispatch(showSnackbar(`Error sending audio cue: ${e.statusText || e.message}`));
      }
    }
  ];
}

module.exports = action;
