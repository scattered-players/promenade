import config from 'config';
import { CREATE_PHASE } from './const';

import showSnackbar from './showSnackbar';

function action(name, kind, attributes) {
  return [
    { type: CREATE_PHASE, name, kind, attributes },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/phases`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            kind,
            attributes
          }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }
        dispatch(showSnackbar('Phase created!'));
      } catch(e) {
        dispatch(showSnackbar(`Error creating phase: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
