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
  let permissions;
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
    permissions = { video: true, audio: true };
  } catch(e){
    permissions = {
      mediaError: e && e.message,
      ...await assessVideoPermissions(videoDeviceId),
      ...await assessAudioPermissions(audioDeviceId)
    }
  }
  console.log('ASSESSED PERMISSIONS', permissions);
  return permissions;
}