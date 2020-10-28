/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
import {
  RECEIVE_REMOTE_FEED,
  REMOVE_REMOTE_FEED
} from '../actions/const';

const initialState = {
  feeds:[]
};

function reducer(state = initialState, action) {
  /* Keep the reducer clean - do not mutate the original state. */
  const nextState = Object.assign({}, state);

  switch (action.type) {

    default: {
      /* Return original state if no actions were consumed. */
      return state;
    }
  }
}

export default reducer;
