import config from 'config';

import { GET_LOCAL_FEED } from './const';

import getLocalFeedFailure from './getLocalFeedFailure';
import getLocalFeedSuccess from './getLocalFeedSuccess';
import setLocalStream from './setLocalStream';
import showSnackbar from './showSnackbar';

import { assessMediaPermissions } from '../util/media';

function action(audioDeviceId, videoDeviceId) {
  return [
    { type: GET_LOCAL_FEED, audioDeviceId, videoDeviceId },
    async dispatch => {
      try{
        let stream, permissions = { video: true, audio: true };
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: videoDeviceId,
              width: { ideal: 4096 },
              height: { ideal: 2160 } 
            },
            audio: {
              deviceId: audioDeviceId
            }
          });
        } catch(e) {
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

        if(permissions.mediaError) {
          dispatch(showSnackbar(`Error getting media stream: ${permissions.mediaError}`));
        }
        
        let videoEl = document.createElement('video');
        if(permissions.video && config.CAN_CAPTURE_STREAM){
          await new Promise(resolve => {
            videoEl.autoplay = true;
            videoEl.defaultMuted = true;
            videoEl.srcObject = stream;
            videoEl.onplaying = () => {
              videoEl.muted = true;
              resolve();
            }
          });
        }
        let mixerContext, audioSource, mixerOutput, mixerOutputStream = stream;
        if(!permissions.mediaError) {
          mixerContext = new AudioContext();
          audioSource = mixerContext.createMediaStreamSource(stream);
          mixerOutput = mixerContext.createMediaStreamDestination();
          mixerOutputStream = mixerOutput.stream;
          audioSource.connect(mixerOutput);
        }

        dispatch(getLocalFeedSuccess(stream, videoEl, mixerContext, audioSource, mixerOutput, mixerOutputStream));
        if(!config.CAN_CAPTURE_STREAM && stream) {
          dispatch(setLocalStream(new MediaStream([...mixerOutputStream.getAudioTracks(), ...stream.getVideoTracks()])));
        }
        dispatch(showSnackbar('Got local feed!'));
      } catch(e) {
        dispatch(getLocalFeedFailure(e.statusText || e.message));
        dispatch(showSnackbar(`Error getting Webcam feed: ${e.statusText || e.message}`));
      }
    }
  ];
}
export default action;
