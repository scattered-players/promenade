import React from 'react';
import { Button } from '@material-ui/core';
import config from 'config';

import { BOOK_TICKET } from './const';

import bookTicketFailure from './bookTicketFailure';
import bookTicketSuccess from './bookTicketSuccess';
import showSnackbar from './showSnackbar';

function action(showId, email) {
  return [
    { type: BOOK_TICKET, showId, email },
    async dispatch => {
      try{
        let response = await fetch(`${ config.SERVICE_HOST }/users/bookTicket`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({showId, email, sendEmail: true }),
          credentials: 'include'
        });
        if (!response.ok) {
          throw response;
        }

        let result = await response.json();

        dispatch(bookTicketSuccess());
        dispatch(showSnackbar(
          <React.Fragment>
            Ticket booked!
            <Button onClick={() => navigator.clipboard.writeText(`${config.ATTENDEE_URL}?token=${result.token}`)}>Click here to copy token</Button>
          </React.Fragment>
        ));
      } catch(e) {
        dispatch(bookTicketFailure(e.statusText || e.message));
        dispatch(showSnackbar(`Error booking ticket: ${e.statusText || e.message}`));
      }
    }
  ];
}

export default action;
