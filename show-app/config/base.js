// Settings configured here will be merged into the final config object.
const IS_WORKER = typeof window === 'undefined';
let CAN_PLAY_WEBM = false;
let IS_MOBILE = typeof window !== 'undefined' && (window.innerHeight < 500 || window.innerWidth < 500)
let mainThreadConfig = {
  CAN_PLAY_WEBM,
  IS_MOBILE
};
if(!IS_WORKER){
  if(typeof document !== 'undefined') {
    let testEl = document.createElement('video');
    CAN_PLAY_WEBM = testEl.canPlayType('video/webm'); 
    testEl = null;
  }
  
  const urlParams = new URLSearchParams(window.location.search),
    BROWSER_CAN_CAPTURE_STREAM = (typeof HTMLMediaElement.prototype.captureStream !== 'undefined'),
    FILTERS_ENABLED = (localStorage.getItem('FILTERS_ENABLED') === 'true'),
    IS_MOBILE = (window.innerHeight < 500 || window.innerWidth < 500),
    CAN_CAPTURE_STREAM = BROWSER_CAN_CAPTURE_STREAM && FILTERS_ENABLED,
    IS_HEADLESS = (urlParams.get('headless') === 'true'),
    SUPPORTED_CONSTRAINTS = navigator.mediaDevices ? navigator.mediaDevices.getSupportedConstraints() : {};

  mainThreadConfig = {
    BROWSER_CAN_CAPTURE_STREAM,
    FILTERS_ENABLED,
    IS_MOBILE,
    CAN_CAPTURE_STREAM,
    IS_HEADLESS,
    SUPPORTED_CONSTRAINTS,
    CAN_PLAY_WEBM
  };
}
export default {
  ...mainThreadConfig
};
