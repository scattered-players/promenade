import debounce from 'lodash/debounce';
import config from 'config';

import { ADJUST_VOLUME } from './const';

async function submitVolumeUpdate(placeId, audioVolume){
  try{
    let response = await fetch(`${ config.SERVICE_HOST }/users/place/volume`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        placeId, audioVolume
      }),
      credentials: 'include'
    });
    if (!response.ok) {
      throw response;
    }
    console.log(`Volume update persisted!`);
  } catch(e) {
    console.error(`Error changing volume: ${e.statusText || e.message}`);
  }
}

const debouncedVolumeSubmission = debounce(submitVolumeUpdate, 1000);

function action(placeId, audioVolume) {
  console.log('HUH?', audioVolume);
  debouncedVolumeSubmission(placeId, audioVolume);
  return { type: ADJUST_VOLUME, placeId, audioVolume };
}

export default action;
