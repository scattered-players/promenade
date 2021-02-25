import config from 'config';
import { UPDATE_PHASE } from './const';

import showSnackbar from './showSnackbar';

function action(phase) {
  return [
    { type: UPDATE_PHASE, phase },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/phases/${phase._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(phase),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }
        dispatch(showSnackbar('Phase updated!'));
      } catch(e) {
        dispatch(showSnackbar(`Error updating phase: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
