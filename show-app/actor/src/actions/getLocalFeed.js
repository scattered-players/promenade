import config from 'config';

import { GET_LOCAL_FEED } from './const';

import getLocalFeedFailure from './getLocalFeedFailure';
import getLocalFeedSuccess from './getLocalFeedSuccess';
import setLocalStream from './setLocalStream';
import showSnackbar from './showSnackbar';

import { assessMediaPermissions } from '../util/media';

function action(audioDeviceId, videoDeviceId, audioConstraints) {
  return [
    { type: GET_LOCAL_FEED, audioDeviceId, videoDeviceId, audioConstraints },
    async (dispatch, getState) => {
      try{
        let stream, permissions = { video: true, audio: true };
        try {
          if((audioDeviceId && audioDeviceId !== 'NONE') || (videoDeviceId && videoDeviceId !== 'NONE')){
            stream = await navigator.mediaDevices.getUserMedia({
              video: (videoDeviceId && videoDeviceId !== 'NONE') ? {
                deviceId: videoDeviceId,
                height: {
                  ideal: 720
                }
              } : false,
              audio: (audioDeviceId && audioDeviceId !== 'NONE') ? {
                deviceId: audioDeviceId,
                echoCancellation: audioConstraints.echoCancellation,
                autoGainControl: audioConstraints.autoGainControl,
                noiseSuppression: audioConstraints.noiseSuppression
              } : false
            });
          } else {
            stream = new MediaStream();
          }
        } catch(e) {
          console.error('ERROR GETTING STREAM', e);
          fetch(`${ config.SERVICE_HOST }/users/reportError`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: 'SOME_ERROR', message: e.message || e }),
            credentials: 'include'
          });
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

        if(permissions.mediaError) {
          dispatch(showSnackbar(`Error getting media stream: ${permissions.mediaError}`));
        }
        dispatch({ type: 'SET_LOCAL_MUTES', audioMute: !(audioDeviceId && audioDeviceId !== 'NONE'), videoMute: !(videoDeviceId && videoDeviceId !== 'NONE')});
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
        let mixerContext = new AudioContext(),
          audioSource,
          mixerOutput = mixerContext.createMediaStreamDestination(),
          mixerOutputStream = mixerOutput.stream;
        if(!permissions.mediaError && stream.getAudioTracks().length) {
          audioSource = mixerContext.createMediaStreamSource(stream);
          // let effect = new Jungle(mixerContext);
          // effect.setPitchOffset(-0.5);
          // audioSource.connect(effect.input);
          
          // let delayNode = mixerContext.createDelay();
          // delayNode.delayTime.value = 0.03;
          
          // effect.output.connect(mixerOutput);

          // let osc = mixerContext.createOscillator();
          // let gain = mixerContext.createGain();

          // gain.gain.value = 0.003; // depth of change to the delay:

          // osc.type = 'sine';
          // osc.frequency.value = 7.5;

          // osc.connect(gain);
          // gain.connect(delayNode.delayTime);
          // // audioSource.connect( delayNode );
          // delayNode.connect( mixerOutput );
          // osc.start(0);
        } else {
          console.error('OHNO NO AUDIO')
        }

        dispatch(getLocalFeedSuccess(stream, videoEl, mixerContext, audioSource, mixerOutput, mixerOutputStream, permissions));
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
