import React from 'react';

import {
  ENDING_VIDEO_CHOICES
} from 'custom/config.json';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';

import './historytab.scss';

class HistoryTab extends React.Component {

  render() {
    const {
      party,
      actions: {
        chooseEnding
      }
    } = this.props;
    return (
      <>
        <FormControl className="settings-dropdown">
          <InputLabel id="ending-select-input-label">Ending</InputLabel>
          <Select
            labelId="ending-select-input-label"
            value={party.chosenEndingURL || ENDING_VIDEO_CHOICES[0]}
            onChange={e => chooseEnding(party._id, e.target.value)}
          >
            {
              ENDING_VIDEO_CHOICES.map(endingUrl => {
                return <MenuItem key={endingUrl} value={endingUrl}>{endingUrl.split('/').pop()}</MenuItem>
              })
            }
          </Select>
        </FormControl>
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
      </>
    );
  }
}

HistoryTab.displayName = 'HistoryTab';
HistoryTab.propTypes = {};
HistoryTab.defaultProps = {};

export default HistoryTab;
