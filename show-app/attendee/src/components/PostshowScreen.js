import React from 'react';
import config from 'config'

import {
  Typography
} from '@material-ui/core';

import './postshowscreen.scss';

class PostshowScreen extends React.Component {

  componentDidMount() {
    location.href = '/program.html';
  }

  render() {
    return (
      <div className="postshowscreen-component">
        <Typography variant="h1">The End!</Typography>
        <Typography variant="h2">Thanks for coming!</Typography>
      </div>
    );
  }
}

PostshowScreen.displayName = 'PostshowScreen';
PostshowScreen.propTypes = {};
PostshowScreen.defaultProps = {};

export default PostshowScreen;
