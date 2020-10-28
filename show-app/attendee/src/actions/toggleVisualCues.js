import { TOGGLE_VISUAL_CUES } from './const';

function action(shouldShowVisualCues) {
  return { type: TOGGLE_VISUAL_CUES, shouldShowVisualCues };
}

export default action;
