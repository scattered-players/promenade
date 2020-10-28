import config from 'config';

import { GIVE_ITEM } from './const';

import showSnackbar from './showSnackbar';

function action(partyId, name, isAnsiblePart=false) {
  return [
    { type: GIVE_ITEM, partyId, name },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/parties/${partyId}/giveItem`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            item: {
              name,
              isAnsiblePart
            }
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Item given!'));
      } catch(e) {
        dispatch(showSnackbar(`Error giving item: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
