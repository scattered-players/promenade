import React from 'react';
import { format } from 'date-fns';

import {
  Chip,
  ListItem,
  ListItemText
} from '@material-ui/core';

import './errorentry.scss';

class ErrorEntry extends React.Component {

  render() {
    const { error } = this.props;
    const dateString = (error && error.timestamp) ? format(new Date(error.timestamp), 'M/d/yy h:mm:ss a') : 'ARGH';
    let errorContent = (
      <ListItemText
        primary={ error ? error.message : 'NO MESSAGE' }
        secondary={ (error && error.value) ? error.value.username : 'NO TOKEN'}
      />
    );
    try{
      switch(error.type) {
        case 'NO_TOKEN_FOR_LOGIN':{
          errorContent = (
            <ListItemText
              primary={ error.message }
              secondary="???"
            />
          )
          break;
        }
        case 'JANUS_ERROR':{
          errorContent = (
            <ListItemText
              primary={ `${error.errorcode}: ${error.message}`}
              secondary={ error.user ? error.user.username : 'NO USER' }
            />
          )
          break;
        }
        default: {
          errorContent = (
            <ListItemText
              primary={ error.message || "???"}
              secondary={error.user ? error.user.username : 'NO USER'}
            />
          );

        }
      }
    } catch(e) {
      console.error('ARRRRGH ERROR DISPLAYING AN ERROR', e);
    }
    return (
      <ListItem className="errorentry-component">
        { errorContent }
        <div className="error-metadata">
          <Chip label={error ? error.type.replace(/_/g, ' ') : 'ARGH'} />
          <div className="error-timestamp">{dateString}</div>
        </div>
      </ListItem>
    );
  }
}

ErrorEntry.displayName = 'ErrorEntry';
ErrorEntry.propTypes = {};
ErrorEntry.defaultProps = {};

export default ErrorEntry;
