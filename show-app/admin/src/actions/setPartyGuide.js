import config from 'config';

import { SET_PARTY_GUIDE } from './const';

import showSnackbar from './showSnackbar';

function action(partyId, guideId) {
  return [
    { type: SET_PARTY_GUIDE, partyId, guideId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/parties/${partyId}/guide/${guideId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Guide assigned!'));
      } catch(e) {
        dispatch(showSnackbar(`Error assigning guide: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
