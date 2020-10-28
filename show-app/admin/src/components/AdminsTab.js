import React from 'react';

import {
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  IconButton
} from '@material-ui/core';

import ClearIcon from '@material-ui/icons/Clear';
import RefreshIcon from '@material-ui/icons/Refresh';

import './adminstab.scss';

class AdminsTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newAdminEmail: ''
    };

    this.createAdmin = this.createAdmin.bind(this);
  }

  createAdmin() {
    const { actions } = this.props;
    const { createAdmin } = actions;
    const { newAdminEmail } = this.state;
    if(newAdminEmail !== '') {
      this.setState({ newAdminEmail: '' }, () => {
        createAdmin(newAdminEmail);
      });
    }
  }

  render() {
    const { actions, system } = this.props;
    const {
      getMagicLink,
      deleteAdmin,
      forceRefreshUser
    } = actions;
    const { admins } = system;
    const { newAdminEmail } = this.state;
    return (
      <>
        <div>
          <TextField label="New Admin Email" value={newAdminEmail} onChange={ e => this.setState({ newAdminEmail: e.target.value }) }/>
          <Button onClick={ this.createAdmin }>Create Admin</Button>
        </div>
        <div>
          <List dense={true}>
            {
              admins.map(admin => (
                <ListItem key={admin._id}>
                  <div className={ 'running-indicator ' + (admin.isOnline ? 'running' : 'not-running')}></div>
                  <ListItemText 
                    primary={admin.username}
                    secondary={admin.email}
                    className="admin-list-item-text"
                  />
                  <Button onClick={()=> getMagicLink(admin._id)}>Get Link</Button>
                  <Typography variant="body1">{admin.currentBrowser}</Typography>
                  <IconButton onClick={() => deleteAdmin(admin._id)}>
                    <ClearIcon />
                  </IconButton>
                  <IconButton onClick={() => forceRefreshUser(admin._id)}>
                    <RefreshIcon />
                  </IconButton>
                </ListItem>
              ))
            }
          </List>
        </div>
      </>
    );
  }
}

AdminsTab.displayName = 'AdminsTab';
AdminsTab.propTypes = {};
AdminsTab.defaultProps = {};

export default AdminsTab;
