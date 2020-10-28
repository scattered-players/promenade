/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
import {
  CHOOSE_SHIP,
  RECEIVE_CURRENT_SHOW_STATE,
  PULL_ITEM,
  ACTIVATE_ANSIBLE,
  SEND_TO_OUTRO_VIDEO
} from '../actions/const';

const initialState = {
  currentShow: null,
  places: [],
  ships: [],
  items: [], //[0,1,2,3,4,5].map(() => ({ _id: '' + Math.random()*1e9, name: 'thing' })),
  shipChosen: -1,
  isAnsibleActive: false,
  ansibleStartTime: null,
  isShowingOutro: false
};

function calcDervivedProperties(state, nextState) {
  if (nextState.currentShow) {
    if (!state.currentShow || state.currentShow.state !== 'ENDING') {
      nextState.ships = nextState.currentShow.parties;
      // nextState.items = [];
    }
  } else {
    nextState.ships = [];
  }
}

function reducer(state = initialState, action) {
  /* Keep the reducer clean - do not mutate the original state. */
  const nextState = Object.assign({}, state);

  switch (action.type) {
    case CHOOSE_SHIP: {
      nextState.shipChosen = action.shipChosen;
      return nextState;
    }
    
    case RECEIVE_CURRENT_SHOW_STATE: {
      let {
        currentShow,
        places
      } = action.body;
      nextState.currentShow = currentShow;
      nextState.places = places;
      calcDervivedProperties(state, nextState);
      return nextState;
    }

    case PULL_ITEM: {
      if (
        nextState.shipChosen > -1 && 
        nextState.shipChosen < nextState.ships.length &&
        nextState.ships[nextState.shipChosen].inventory.length
      ) {
        let transferItem = nextState.ships[nextState.shipChosen].inventory[0];
        console.log('PULLED ITEM: ', transferItem);
        nextState.ships[nextState.shipChosen].inventory = [...nextState.ships[nextState.shipChosen].inventory.slice(1)];
        nextState.items = [...nextState.items, transferItem];
      }
      return nextState;
    }

    case ACTIVATE_ANSIBLE: {
      nextState.isAnsibleActive = true;
      nextState.ansibleStartTime = Date.now();
      return nextState;
    }

    case SEND_TO_OUTRO_VIDEO: {
      nextState.isShowingOutro = true;
      return nextState;
    }

    default: {
      /* Return original state if no actions were consumed. */
      return state;
    }
  }
}

export default reducer;
