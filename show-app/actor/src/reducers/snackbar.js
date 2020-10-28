/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
import {
  DISMISS_SNACKBAR,
  SHOW_SNACKBAR
} from '../actions/const';

const initialState = {
  open: false,
  text: '',
  timeout: 0
};

function reducer(state = initialState, action) {
  /* Keep the reducer clean - do not mutate the original state. */
  const nextState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case SHOW_SNACKBAR: {
      nextState.text = action.text;
      nextState.timeout = action.timeout;
      nextState.open = true;
      return nextState;
    }

    case DISMISS_SNACKBAR: {
      nextState.text = '';
      nextState.open = false;
      return nextState;
    }

    default: {
      /* Return original state if no actions were consumed. */
      return state;
    }
  }
}

export default reducer;
