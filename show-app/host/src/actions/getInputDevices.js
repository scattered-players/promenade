import config from 'config';
import { GET_INPUT_DEVICES } from './const';

import getInputDevicesFailure from './getInputDevicesFailure';
import getInputDevicesSuccess from './getInputDevicesSuccess';
import showSnackbar from './showSnackbar';

import { assessMediaPermissions } from '../util/media';

function action() {
  return async dispatch => {
    let showConsentTimeout = setTimeout(() => {
      dispatch({ type: GET_INPUT_DEVICES });
    }, 100);
    try {
      let permissions = await assessMediaPermissions();
      clearTimeout(showConsentTimeout);

      fetch(`${ config.SERVICE_HOST }/users/mediaErrors`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(permissions),
        credentials: 'include'
      });

      if(permissions.mediaError) {
        dispatch(showSnackbar(`Error getting input devices: ${permissions.mediaError}`));
      }
      
      let devices = await navigator.mediaDevices.enumerateDevices();
      console.log('GOT DEVICES', devices);
      dispatch(getInputDevicesSuccess(devices));
    } catch(e) {
      clearTimeout(showConsentTimeout);
      dispatch(getInputDevicesFailure(e.message));
      dispatch(showSnackbar(`Error getting input devices: ${e.message}`));
    }
  }
}
  
export default action;
