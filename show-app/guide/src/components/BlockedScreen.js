import React from 'react';

import {
  SHOW_TITLE,
  COMPANY_EMAIL
} from 'custom/config.json';

import {
  Container,
  Typography
} from '@material-ui/core';

class BlockedScreen extends React.Component {
  render() {
    return (
      <Container>
        <Typography variant="h1">You've been blocked</Typography>
        <Typography variant="body1">
          { `Anyone who violates our code of conduct (which all attendees must accept in order to purchase a ticket) will be blocked from attending performances of ${ SHOW_TITLE }.` }
        </Typography>
        <Typography variant="body1">
          { `If this was a mistake, you can contact us at ${COMPANY_EMAIL} to resolve the issue.` }
        </Typography>
      </Container>
    );
  }
}

BlockedScreen.displayName = 'BlockedScreen';
BlockedScreen.propTypes = {};
BlockedScreen.defaultProps = {};

export default BlockedScreen;
