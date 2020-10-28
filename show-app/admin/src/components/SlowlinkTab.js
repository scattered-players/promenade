import React from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';

import SLOWLINK_TYPES from '../enum/slowlinkTypes';

import './slowlinktab.scss';

class SlowlinkTab extends React.Component {
  componentDidMount() {
    const {
      actions: {
        refreshSlowlinkData
      }
    } = this.props;
    this.refreshInterval = setInterval(refreshSlowlinkData, 3*1000);
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
  }

  render() {
    const {
      system: {
        slowlinkData,
        slowlinkEvents
      }
    } = this.props;
    console.log('SLOWLINK', slowlinkData, slowlinkEvents);
    return (
      <div className="slowlinktab-component">
        <TableContainer component={Paper}>
          <Table size="small" aria-label="Slowlink Table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              {
                Object.keys(SLOWLINK_TYPES).map(type => <TableCell key={type} align="center">{type}</TableCell>)
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {slowlinkData.map(slowlinkUser => (
              <TableRow key={slowlinkUser.user._id}>
                <TableCell component="th" scope="row">
                  {slowlinkUser.user.username}
                </TableCell>
                {
                  Object.keys(SLOWLINK_TYPES).map(type => <TableCell key={type} align="center">{slowlinkUser.totals[type]}</TableCell>)
                }
              </TableRow>
            ))}
          </TableBody>

          </Table>
        </TableContainer>
      </div>
    );
  }
}

SlowlinkTab.displayName = 'SlowlinkTab';
SlowlinkTab.propTypes = {};
SlowlinkTab.defaultProps = {};

export default SlowlinkTab;
