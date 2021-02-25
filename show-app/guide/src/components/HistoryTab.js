import React from 'react';

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
      {
        party.videoChoices.map(choice => (
          <FormControl key={choice._id} className="settings-dropdown">
            <InputLabel id="ending-select-input-label">{choice.phase.name}</InputLabel>
            <Select
              labelId="ending-select-input-label"
              value={choice.choiceURL}
              onChange={e => chooseEnding(party._id, choice.phase._id,  e.target.value)}
            >
              {
                choice.phase.attributes.videoList.map(videoChoice => {
                  console.log('HMM', videoChoice)
                  return <MenuItem key={videoChoice} value={videoChoice}>{videoChoice.split('/').pop()}</MenuItem>
                })
              }
            </Select>
          </FormControl>
        ))
      }
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
