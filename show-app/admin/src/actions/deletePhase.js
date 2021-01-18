import config from 'config';
import { DELETE_PHASE } from './const';

import showSnackbar from './showSnackbar';

function action(phaseId) {
  return [
    { type: DELETE_PHASE, phaseId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/phases/${phaseId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Phase deleted.'));
      } catch(e) {
        dispatch(showSnackbar(`Error deleting phase: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
