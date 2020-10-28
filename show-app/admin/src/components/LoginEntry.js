import React from 'react';
import { format } from 'date-fns';

import {
  Chip,
  ListItem,
  ListItemText
} from '@material-ui/core';

import './loginentry.scss';

class LoginEntry extends React.Component {

  render() {
    const { login } = this.props;
    const dateString = format(new Date(login.timestamp), 'M/d/yy h:mm:ss a');
    return (
      <ListItem className="loginentry-component">
        <ListItemText
          className="login-info"
          primary={ `${login.user.kind} ${login.user.username}` }
          secondary={ dateString }
        />
        <Chip label={login.type.replace(/_/g, ' ')} />
      </ListItem>
    );
  }
}

LoginEntry.displayName = 'LoginEntry';
LoginEntry.propTypes = {};
LoginEntry.defaultProps = {};

export default LoginEntry;
