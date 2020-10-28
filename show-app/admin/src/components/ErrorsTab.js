import React from 'react';

import {
  List,
  Paper,
  Typography
} from '@material-ui/core';

import LoginEntry from './LoginEntry';
import ErrorEntry from './ErrorEntry';

import './errorstab.scss';

class ErrorsTab extends React.Component {

  render() {
    const {
      system: {
        logins,
        errors
      }
    } = this.props;
    return (
      <div className="errorstab-component">
        <Paper className="log-column">
          <Typography variant="h3">Logins</Typography>
          <List>
            {
              logins.map(login => <LoginEntry key={login.id} login={login} />)
            }
          </List>
        </Paper>
        <Paper className="log-column">
          <Typography variant="h3">Errors</Typography>
          <List>
            {
              errors.map(error => <ErrorEntry key={error.id} error={error} />)
            }
          </List>
        </Paper>
      </div>
    );
  }
}

ErrorsTab.displayName = 'ErrorsTab';
ErrorsTab.propTypes = {};
ErrorsTab.defaultProps = {};

export default ErrorsTab;
