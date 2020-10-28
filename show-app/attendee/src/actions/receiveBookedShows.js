import { RECEIVE_BOOKED_SHOWS } from './const';

function action(bookedShows) {
  return { type: RECEIVE_BOOKED_SHOWS, bookedShows };
}

export default action;
