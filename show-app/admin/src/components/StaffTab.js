import React from 'react';

import {
  Typography
} from '@material-ui/core';

import ActorsTab from './ActorsTab';
import AdminsTab from './AdminsTab';
import GuidesTab from './GuidesTab';

import './stafftab.scss';

class StaffTab extends React.Component {

  render() {
    return (
      <div className="stafftab-component">
        <Typography variant="h2">Actors</Typography>
        <ActorsTab {...this.props} />
        <Typography variant="h2">Guides</Typography>
        <GuidesTab {...this.props} />
        <Typography variant="h2">Admins</Typography>
        <AdminsTab {...this.props} />
      </div>
    );
  }
}

StaffTab.displayName = 'StaffTab';
StaffTab.propTypes = {};
StaffTab.defaultProps = {};

export default StaffTab;
