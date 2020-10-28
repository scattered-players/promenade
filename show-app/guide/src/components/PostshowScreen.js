import React from 'react';

import {
  Typography
} from '@material-ui/core';

import './postshowscreen.scss';

class PostshowScreen extends React.Component {

  render() {
    return (
      <div className="postshowscreen-component">
        <Typography variant="h1">The End!</Typography>
        <Typography variant="body1">If there's another show you're in, hang tight. It'll be PreShow in just a moment.</Typography>
      </div>
    );
  }
}

PostshowScreen.displayName = 'PostshowScreen';
PostshowScreen.propTypes = {};
PostshowScreen.defaultProps = {};

export default PostshowScreen;
