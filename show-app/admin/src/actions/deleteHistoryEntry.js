import config from 'config';

import { DELETE_HISTORY_ENTRY } from './const';

import showSnackbar from './showSnackbar';

function action(partyId, index) {
  return [
    { type: DELETE_HISTORY_ENTRY, partyId, index },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/parties/${partyId}/history/${index}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('History entry deleted.'));
      } catch(e) {
        dispatch(showSnackbar(`Error deleting history entry: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
