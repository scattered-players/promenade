import React from 'react';

import {
  Badge,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';

import './placetab.scss';

class PlaceTab extends React.Component {

  render() {
    const { system } = this.props,
    {
      places,
    } = system;
    return (
      <div className="placetab-component">
        <Typography>Places</Typography>
        <List className="tab-panel-list">
          {
            places.map(place => (
              <ListItem key={place._id}>
                <ListItemText
                  primary={place.placeName}
                  secondary={`${place.characterName}`}
                />
                <Badge badgeContent={place.partyQueue.length + (place.currentParty ? 1 : 0)} color="error" />
              </ListItem>
            ))
          }
        </List>
      </div>
    );
  }
}

PlaceTab.displayName = 'PlaceTab';
PlaceTab.propTypes = {};
PlaceTab.defaultProps = {};

export default PlaceTab;
