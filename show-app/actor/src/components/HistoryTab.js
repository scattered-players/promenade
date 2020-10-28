import React from 'react';

import {
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';

import './historytab.scss';

class HistoryTab extends React.Component {

  render() {
    const {
      party
    } = this.props;
    return (
      <div className="historytab-component">
        <List className="tab-panel-list">
          {
            party.history.map((place, index) => (
              <ListItem key={`${party._id}-${place._id}-${index}`}>
                <ListItemText
                  primary={place.placeName}
                  secondary={place.characterName}
                />
              </ListItem>
            ))
          }
        </List>
      </div>
    );
  }
}

HistoryTab.displayName = 'HistoryTab';
HistoryTab.propTypes = {};
HistoryTab.defaultProps = {};

export default HistoryTab;
