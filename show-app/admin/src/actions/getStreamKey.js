import config from 'config';

import { GET_STREAM_KEY } from './const';

import showSnackbar from './showSnackbar';

function action(showId) {
  return [
    { type: GET_STREAM_KEY, showId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/shows/streamkey/${showId}`, {
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
