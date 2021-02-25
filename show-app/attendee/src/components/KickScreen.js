import React from 'react';

import {
  Typography
} from '@material-ui/core';

class KickScreen extends React.Component {

  componentDidMount() {
    location.href = '/program.html';
  }

  render() {
    return (
      <div>
        <Typography variant="h1">The End!</Typography>
        <Typography variant="h2">Thanks for coming!</Typography>
      </div>
    );
  }
}

KickScreen.displayName = 'KickScreen';
KickScreen.propTypes = {};
KickScreen.defaultProps = {};

export default KickScreen;
