import React from 'react';

import {
  Container,
  Paper,
  Typography,
  Button
} from '@material-ui/core';

import Main from './Main';

import './app.scss';
import 'custom/theme/theme.scss';

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
        reportError
      }
    } = this.props;

    reportError({
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
              If it doesn't, hit up the #tech-issues channel on Slack.
            </Typography>
            <Typography variant="body1">
              If the error says <i>"Failed to execute 'createMediaStreamSource' on 'AudioContext': MediaStream has no audio track"</i>, then clicking the button below will probably solve it.
              But it will also reset your notification and "Show Nerdy Stats" settings, so make sure to check on those when you get back in.
            </Typography>
            <Button variant="contained" onClick={() => localStorage.clear() || location.reload()}>Clear localStorage and Refresh</Button>
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
