import config from 'config';

import { TAKE_ITEM } from './const';

import showSnackbar from './showSnackbar';

function action(partyId, itemId) {
  return [
    { type: TAKE_ITEM, partyId, itemId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/parties/${partyId}/takeItem/${itemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Item taken!'));
      } catch(e) {
        dispatch(showSnackbar(`Error taking item: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
