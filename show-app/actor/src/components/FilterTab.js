import React from 'react';
import config from 'config';

import {
  MenuList,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  Switch,
  Typography
} from '@material-ui/core';

import FILTERS from 'custom/filters';
const FILTER_NAMES = Object.keys(FILTERS);


import LITE_FILTERS from 'custom/lite-filters';
const LITE_FILTER_NAMES = [null, ...Object.keys(LITE_FILTERS)];

import './filtertab.scss';

class FilterTab extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      filtersEnabled: config.FILTERS_ENABLED
    };

    this.toggleFilters = this.toggleFilters.bind(this);
  }

  toggleFilters(value) {
    this.setState({ filtersEnabled: value }, () => {
      localStorage.setItem('FILTERS_ENABLED', value);
      location.reload();
    });
  }

  render() {
    const {
      actions,
      system
    } = this.props,
    {
      setFilterName,
      setLiteFilter,
      getLocalFeed
    } = actions,
    {
      activeFilter,
      videoInputs,
      audioInputs,
      chosenAudioInput,
      chosenVideoInput,
      audioConstraints,
      myPlace
    } = system,
    {
      filtersEnabled
    } = this.state;
    return (
      <div className="filtertab-component">
        { 
          chosenAudioInput && 
            <FormControl className="settings-dropdown">
              <InputLabel id="microphone-select-input-label">Microphone</InputLabel>
              <Select
                labelId="microphone-select-input-label"
                value={chosenAudioInput}
                onChange={e => getLocalFeed(e.target.value, chosenVideoInput, audioConstraints)}
              >
                {audioInputs.map(device => (
                  <MenuItem key={device.deviceId} value={device.deviceId}>{device.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
        }
        {
          chosenVideoInput && 
            <FormControl className="settings-dropdown">
              <InputLabel id="camera-select-input-label">Camera</InputLabel>
              <Select
                labelId="camera-select-input-label"
                value={chosenVideoInput}
                onChange={e => getLocalFeed(chosenAudioInput, e.target.value, audioConstraints)}
              >
                {videoInputs.map(device => (
                  <MenuItem key={device.deviceId} value={device.deviceId}>{device.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
        }
        <Typography>Filter Options</Typography>
        { config.BROWSER_CAN_CAPTURE_STREAM
          ? <FormControlLabel control={<Switch checked={filtersEnabled} onChange={ e => this.toggleFilters(e.target.checked) } />} label="Enable Filters (may cause camera lag)"/>
          : <Typography>This browser does not support HTMLMediaElement.captureStream, so we can't use filters</Typography>
        }
        { config.CAN_CAPTURE_STREAM &&
          <MenuList>
            {
              FILTER_NAMES.map(name => <MenuItem key={name} selected={name===activeFilter} onClick={() => setFilterName(name)}>{name}</MenuItem>)
            }
          </MenuList>
        }
        <Typography>Lite Filter Options</Typography>
          <MenuList>
            {
              LITE_FILTER_NAMES.map(name => <MenuItem key={name} selected={name==myPlace.currentFilter} onClick={() => setLiteFilter(myPlace._id, name)}>{name || 'None'}</MenuItem>)
            }
          </MenuList>
      </div>
    );
  }
}

FilterTab.displayName = 'FilterTab';
FilterTab.propTypes = {};
FilterTab.defaultProps = {};

export default FilterTab;
