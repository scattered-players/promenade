import React from 'react';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField
} from '@material-ui/core';

import './settings.scss';

class Settings extends React.Component {
  constructor(){
    super();
    this.state = {
      username: '',
      characterName: '',
      audioPath: ''
    };
    this.updateSettings = this.updateSettings.bind(this);
  }
  componentDidMount() {
    const {
      system:{
        user: {
          username,
          characterName,
          audioPath
        }
      }
    } = this.props;
    this.setState({
      username,
      characterName,
      audioPath
    })
  }

  updateSettings(){
    const {
      system: {
        user
      },
      actions: {
        changeUsername,
        setGuideInfo
      },
      onClose
    } = this.props;
    console.log('SIP')

    if(user.username !== this.state.username){
      changeUsername(user._id, this.state.username);
    }

    if(user.characterName !== this.state.characterName || user.audioPath !== this.state.audioPath){
      setGuideInfo(user._id, this.state.characterName, this.state.audioPath);
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
      videoInputs,
      audioInputs,
      chosenAudioInput,
      chosenVideoInput,
      isNerdy,
      shouldShowVisualCues
    } = system,
    {
      getLocalStream,
      toggleNerdiness,
      toggleVisualCues
    } = actions,
    {
      username,
      characterName,
      audioPath
    } = this.state;
    return (
      <Dialog onClose={onClose} open={true} >
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <TextField label="username" value={username} onChange={e => this.setState({username: e.target.value})} />
          <TextField label="character name" value={characterName} onChange={e => this.setState({characterName: e.target.value})} />
          <TextField label="audio path" value={audioPath || ''} onChange={e => this.setState({audioPath: e.target.value})} />
          <FormControl className="settings-dropdown">
            <InputLabel id="microphone-select-input-label">Microphone</InputLabel>
            <Select
              labelId="microphone-select-input-label"
              value={chosenAudioInput}
              onChange={e => getLocalStream(e.target.value, chosenVideoInput)}
            >
              {audioInputs.map(device => {
                return <MenuItem key={'deviceId:' + device.deviceId} value={device.deviceId}>{device.label}</MenuItem>
              })}
            </Select>
          </FormControl>
          <FormControl className="settings-dropdown">
            <InputLabel id="camera-select-input-label">Camera</InputLabel>
            <Select
              labelId="camera-select-input-label"
              value={chosenVideoInput}
              onChange={e => getLocalStream(chosenAudioInput, e.target.value)}
            >
              {
                videoInputs.map(device => (
                  <MenuItem key={device.deviceId} value={device.deviceId}>{device.label}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <FormControlLabel control={<Switch checked={isNerdy} onChange={ e => toggleNerdiness(e.target.checked) } />} label="Show Nerdy Stats"/>
          <FormControlLabel control={<Switch checked={shouldShowVisualCues} onChange={ e => toggleVisualCues(e.target.checked) } />} label="Show Visual Cues" />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={() => this.updateSettings()}>OK</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

Settings.displayName = 'Settings';
Settings.propTypes = {};
Settings.defaultProps = {};

export default Settings;
