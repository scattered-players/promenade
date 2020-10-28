import { CHOOSE_SHIP } from './const';

function action(shipChosen) {
  return { type: CHOOSE_SHIP, shipChosen };
}

export default action;
