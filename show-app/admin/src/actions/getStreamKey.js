import config from 'config';

import { GET_STREAM_KEY } from './const';

import showSnackbar from './showSnackbar';

function action(phaseId) {
  return [
    { type: GET_STREAM_KEY, phaseId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/phases/${phaseId}/streamkey`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }
        let result = await response.json();
        navigator.clipboard.writeText(result.streamKey)

        dispatch(showSnackbar('Stream key copied!'));
      } catch(e) {
        dispatch(showSnackbar(`Error getting stream key: ${e.statusText || e.message}`));
      }
    }

  ];
}

module.exports = action;
