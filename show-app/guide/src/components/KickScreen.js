import React from 'react';

import {
  Typography
} from '@material-ui/core';


class KickScreen extends React.Component {

  render() {
    return (
      <div className="postshowscreen-component">
        <Typography variant="h1">The End!</Typography>
        <Typography variant="body1">If there's another show you're in, hang tight. It'll be PreShow in just a moment.</Typography>
      </div>
    );
  }
}

KickScreen.displayName = 'KickScreen';
KickScreen.propTypes = {};
KickScreen.defaultProps = {};

export default KickScreen;
