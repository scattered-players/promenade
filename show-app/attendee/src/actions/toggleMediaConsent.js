import { TOGGLE_MEDIA_CONSENT } from './const';

function action(askingMediaConsent) {
  return { type: TOGGLE_MEDIA_CONSENT, askingMediaConsent };
}

export default action;
