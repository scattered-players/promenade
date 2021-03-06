import React from 'react';

import {
  Container,
  Paper,
  Typography
} from '@material-ui/core';

import Main from './Main';

import './app.scss';

class AppComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log('OHNO', error);
    return { error };
  }

  static getDerivedStateFromProps(props, state) {
    const {
      system: {
        error
      }
    } = props;
    if (error) {
      state.error = error;
    }
    return state;
  }

  componentDidCatch(error, info) {
    const {
      actions: {
        sendError
      }
    } = this.props;

    sendError({
      type: 'REACT_ERROR',
      message: error.message || error,
      stack: info.componentStack
    });
  }

  render() {
    const { actions, system, snackbar, socketStatus } = this.props;
    const { error } = this.state;
    console.log('SYSTEM', system);
    return (
      !!error
      ? (
        <Container>
          <Paper style={{margin: 20, padding: 20}} elevation={3}>
            <Typography variant="h2">Error</Typography>
            <Typography variant="body1" color="error">{ error ? (error.message || error) : 'We can\'t figure out what the error is.' }</Typography>
            <Typography variant="body1">
              Sometimes refreshing the page can fix the error.
              If it doesn't, hit up the #show channel on Slack.
            </Typography>
          </Paper>
        </Container>
      ) : (
        <Main system={system} actions={actions} snackbar={snackbar} socketStatus={socketStatus} />
      )
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
