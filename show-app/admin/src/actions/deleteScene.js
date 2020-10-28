import config from 'config';

import { DELETE_SCENE } from './const';

import showSnackbar from './showSnackbar';

function action(sceneId) {
  return [
    { type: DELETE_SCENE, sceneId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/parties/scene/${sceneId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Scene deleted.'));
      } catch(e) {
        dispatch(showSnackbar(`Error deleting scene: ${e.statusText || e.message}`));
      }
    }
  ];
}

module.exports = action;
