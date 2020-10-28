import React from 'react';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Switch,
  TextField,
  Typography
} from '@material-ui/core';

import assetKeyEnum from 'custom/assetKey';
const ASSET_KEYS = Object.keys(assetKeyEnum);

import './characterinfo.scss';

class CharacterInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      placeName: '',
      characterName: '',
      flavorText: '',
      audioPath: '',
      assetKey: ASSET_KEYS[0]
    };
    this.updateSettings = this.updateSettings.bind(this);
  }
  componentDidMount() {
    const {
      system: {
        user: {
          username
        },
        myPlace: {
          placeName,
          characterName,
          flavorText,
          audioPath,
          assetKey
        }
      }
    } = this.props;
    this.setState({
      username,
      placeName,
      characterName,
      flavorText,
      audioPath,
      assetKey
    })
  }

  updateSettings() {
    const {
      system: {
        user,
        myPlace
      },
      actions: {
        changeUsername,
        changePlace
      },
      onClose
    } = this.props,
      {
        username,
        placeName,
        characterName,
        flavorText,
        audioPath,
        assetKey
      } = this.state,
      shouldUpdateUsername = (user.username !== username),
      shouldUpdatePlace = (
        myPlace.placeName !== placeName ||
        myPlace.characterName !== characterName ||
        myPlace.flavorText !== flavorText ||
        myPlace.audioPath !== audioPath ||
        myPlace.assetKey !== assetKey
      );

    if (shouldUpdateUsername) {
      changeUsername(user._id, username);
    }

    if(shouldUpdatePlace){
      changePlace(myPlace._id, placeName, characterName, flavorText, audioPath, assetKey);
    }

    onClose();
  }

  render() {
    const {
      system,
      actions,
      onClose
    } = this.props,
    { 
      username,
      placeName,
      characterName,
      flavorText,
      audioPath,
      assetKey
    } = this.state;
    return (
      <Dialog onClose={onClose} open={true} >
        <DialogTitle>Character/Place Info</DialogTitle>
        <DialogContent>
          <TextField label="Username" value={username} onChange={e => this.setState({ username: e.target.value })} />
          <TextField label="Place Name" value={placeName || ''} onChange={e => this.setState({ placeName: e.target.value })} />
          <TextField label="Character Name" value={characterName || ''} onChange={e => this.setState({ characterName: e.target.value })} />
          <TextField label="Place Flavor Text" value={flavorText || ''} onChange={e => this.setState({ flavorText: e.target.value })} />
          <TextField label="Audio File Path" value={audioPath || ''} onChange={e => this.setState({ audioPath: e.target.value })} />
          <FormControl className="model-key-dropdown">
            <InputLabel id="model-key-select-input-label">Asset Key</InputLabel>
            <Select
              labelId="model-key-select-input-label"
              value={assetKey}
              onChange={e => this.setState({ assetKey: e.target.value })}
            >
              {ASSET_KEYS.map(assetKey => <MenuItem key={assetKey} value={assetKey}>{assetKey}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={() => this.updateSettings()}>OK</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

CharacterInfo.displayName = 'CharacterInfo';
CharacterInfo.propTypes = {};
CharacterInfo.defaultProps = {};

export default CharacterInfo;
