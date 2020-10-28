/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
import {
  CONTACT_SHOW_SERVICE,
  CONTACT_SHOW_SERVICE_SUCCESS,
  LOST_CONTACT_WITH_SHOW_SERVICE
} from '../actions/const';
import socketStatus from '../enum/socketStatus';

const initialState = {
  triedConnecting: false,
  connectionStatus: socketStatus.NOT_CONNECTED
};

function reducer(state = initialState, action) {
  /* Keep the reducer clean - do not mutate the original state. */
  // const nextState = Object.assign({}, state);
  const nextState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case CONTACT_SHOW_SERVICE: {
      nextState.triedConnecting = true;
      nextState.connectionStatus = socketStatus.CONNECTING;
      return nextState;
    }
    case CONTACT_SHOW_SERVICE_SUCCESS: {
      nextState.connectionStatus = socketStatus.CONNECTED;
      return nextState;
    }
    case LOST_CONTACT_WITH_SHOW_SERVICE: {
      nextState.connectionStatus = socketStatus.NOT_CONNECTED;
      return nextState;
    }
    default: {
      /* Return original state if no actions were consumed. */
      return state;
    }
  }
}

export default reducer;
