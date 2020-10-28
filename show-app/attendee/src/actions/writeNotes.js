import config from 'config';

import { WRITE_NOTES } from './const';

import showSnackbar from './showSnackbar';

function action(partyId, notes) {
  return [
    { type: WRITE_NOTES, partyId, notes },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/parties/${partyId}/notes`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notes
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        // dispatch(showSnackbar('Notes saved!'));
      } catch(e) {
        dispatch(showSnackbar(`Error saving notes: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
