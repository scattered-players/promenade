import config from 'config';

import { GET_LOCAL_STREAM } from './const';

import getLocalStreamFailure from './getLocalStreamFailure';
import getLocalStreamSuccess from './getLocalStreamSuccess';
import showSnackbar from './showSnackbar';

import { assessMediaPermissions } from '../util/media';

function action(audioDeviceId, videoDeviceId) {
  return [
    { type: GET_LOCAL_STREAM, audioDeviceId, videoDeviceId },
    async (dispatch, getState) => {
      try {
        let stream, permissions = { video: true, audio: true };
        try {
          if((audioDeviceId && audioDeviceId !== 'NONE') || (videoDeviceId && videoDeviceId !== 'NONE')){
            stream = await navigator.mediaDevices.getUserMedia({
              video: (videoDeviceId && videoDeviceId !== 'NONE') ? {
                deviceId: videoDeviceId,
                height: {
                  ideal: 240
                },
                frameRate: {
                  ideal: 10
                }
              } : false,
              audio: (audioDeviceId && audioDeviceId !== 'NONE') ? {
                deviceId: audioDeviceId,
              } : false
            });
          } else {
            stream = new MediaStream();
          }
        } catch(e) {
          console.error('ERROR GETTING STREAM', e);
          stream = new MediaStream();
          permissions = await assessMediaPermissions(audioDeviceId, videoDeviceId);
        }

        fetch(`${ config.SERVICE_HOST }/users/mediaErrors`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(permissions),
          credentials: 'include'
        });
        dispatch({ type: 'SET_LOCAL_MUTES', audioMute: !(audioDeviceId && audioDeviceId !== 'NONE'), videoMute: !(videoDeviceId && videoDeviceId !== 'NONE')})
        await fetch(`${ config.SERVICE_HOST }/users/mutes`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: getState().system.user._id,
            isAudioMuted: !(audioDeviceId && audioDeviceId !== 'NONE'),
            isVideoMuted: !(videoDeviceId && videoDeviceId !== 'NONE')
          }),
          credentials: 'include'
        });

        if(permissions.mediaError) {
          dispatch(showSnackbar(`Error getting media stream: ${permissions.mediaError}`));
        }

        dispatch(getLocalStreamSuccess(stream, permissions));
      } catch(e) {
        dispatch(getLocalStreamFailure(e.message));
        dispatch(showSnackbar(`Error getting media stream: ${e.message}`));
      }
    }
  ];
}

export default action;
