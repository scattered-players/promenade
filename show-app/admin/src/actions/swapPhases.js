import config from 'config';
import { SWAP_PHASES } from './const';

import showSnackbar from './showSnackbar';

function action(phase1, phase2) {
  return [
    { type: SWAP_PHASES, phase1, phase2 },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/phases/${phase1._id}/swap/${phase2._id}`, {
          method: 'PUT',
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }
        dispatch(showSnackbar('Phases swapped!'));
      } catch(e) {
        dispatch(showSnackbar(`Error swapping phases: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
