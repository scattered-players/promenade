export async function assessAudioPermissions(audioDeviceId) {
  try {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: audioDeviceId ? { deviceId: audioDeviceId } : true
    });
    stream.getTracks().map(track => {
      stream.removeTrack(track);
      track.stop();
    });
    return {
      audio:true
    };
  } catch(e){
    return {
      audio:false,
      audioError: e && e.message
    };
  }
}

export async function assessVideoPermissions(videoDeviceId) {
  try {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: videoDeviceId ? { deviceId: videoDeviceId } : true,
      audio: false
    });
    stream.getTracks().map(track => {
      stream.removeTrack(track);
      track.stop();
    });
    return {
      video: true
    };
  } catch(e){
    return {
      video:false,
      videoError: e && e.message
    };
  }
}

export async function assessMediaPermissions(audioDeviceId, videoDeviceId) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(`
      Your browser does not support audio/video chat features, and thus will not work with this show. 
      If you are on iOS, make sure you are using Safari and not an alternative browser such as Chrome for iOS.
    `);
  }
  try {
    let constraints = {};
    constraints.video = videoDeviceId ? { deviceId: videoDeviceId } : true;
    constraints.video = audioDeviceId ? { deviceId: audioDeviceId } : true;
    let stream = await navigator.mediaDevices.getUserMedia({
      video: videoDeviceId ? { deviceId: videoDeviceId } : true,
      audio: audioDeviceId ? { deviceId: audioDeviceId } : true
    });
    stream.getTracks().map(track => {
      stream.removeTrack(track);
      track.stop();
    });
    return { video: true, audio: true };
  } catch(e){
    return {
      mediaError: e && e.message,
      ...await assessVideoPermissions(videoDeviceId),
      ...await assessAudioPermissions(audioDeviceId)
    }
  }
}