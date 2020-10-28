import config from 'config';

import { MOVE_ATTENDEE } from './const';

import showSnackbar from './showSnackbar';

function action(attendanceId, fromPartyId, toPartyId) {
  return [
    { type: MOVE_ATTENDEE, attendanceId, fromPartyId, toPartyId },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/moveAttendee`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ attendanceId, fromPartyId, toPartyId }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        dispatch(showSnackbar('Attendee moved!'));
      } catch(e) {
        dispatch(showSnackbar(`Error moving attendee: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
