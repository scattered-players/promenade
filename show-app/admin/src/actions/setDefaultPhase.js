import config from 'config';
import { SET_DEFAULT_PHASE } from './const';

import showSnackbar from './showSnackbar';

function action(phase) {
  return [
    { type: SET_DEFAULT_PHASE, phase },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/phases/${phase._id}/default`, {
          method: 'PUT',
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }
        dispatch(showSnackbar('Phase set as default!'));
      } catch(e) {
        dispatch(showSnackbar(`Error setting phase as default: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
