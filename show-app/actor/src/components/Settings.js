import React from 'react';

import config from 'config';

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

import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';

import assetKeyEnum from 'custom/assetKey';
const ASSET_KEYS = Object.keys(assetKeyEnum);

import './settings.scss';

class Settings extends React.Component {
  render() {
    const {
      system,
      actions,
      onClose
    } = this.props,
    {
      chosenAudioInput,
      chosenVideoInput,
      isNerdy,
      wantsNotifications,
      myCurrentPlace,
      isMonitorOn,
      audioConstraints:{
        echoCancellation,
        autoGainControl,
        noiseSuppression
      }
    } = system,
    {
      getLocalFeed,
      toggleNerdiness,
      toggleNotifications,
      adjustVolume,
      toggleMonitor
    } = actions;
    return (
      <Dialog onClose={onClose} open={true} >
        <DialogTitle>
          Settings
        </DialogTitle>
        <DialogContent>
          <Typography variant="h5">Audio/Video</Typography>
          <TextField label="Music Volume" value={myCurrentPlace.audioVolume || 0} onChange={e => adjustVolume(myCurrentPlace._id, e.target.value)} />
          <Grid container spacing={2}>
            <Grid item>
              <VolumeDownIcon />
            </Grid>
            <Grid item xs>
              <Slider
                value={myCurrentPlace.audioVolume || 0 }
                onChange={(e,newValue) => adjustVolume(myCurrentPlace._id, newValue)}
                aria-labelledby="continuous-slider"
                min={0}
                max={1}
                step={0.001}
              />
            </Grid>
            <Grid item>
              <VolumeUpIcon />
            </Grid>
          </Grid>
          <FormControlLabel control={<Switch checked={isMonitorOn} onChange={ e => toggleMonitor(e.target.checked) } />} label="Enable Monitor (I hope you have headphones)"/>
          {
            config.SUPPORTED_CONSTRAINTS.echoCancellation && (
              <FormControlLabel
                control={
                  <Switch checked={echoCancellation} onChange={ e => getLocalFeed(chosenAudioInput, chosenVideoInput, { echoCancellation: e.target.checked, autoGainControl, noiseSuppression }) } />
                }
                label="Enable Echo Cancellation"
              />
            )
          }
          {
            config.SUPPORTED_CONSTRAINTS.autoGainControl && (
              <FormControlLabel
                control={
                  <Switch checked={autoGainControl} onChange={ e => getLocalFeed(chosenAudioInput, chosenVideoInput, { echoCancellation, autoGainControl: e.target.checked, noiseSuppression }) } />
                }
                label="Enable Auto Gain Control"
              />
            )
          }
          {
            config.SUPPORTED_CONSTRAINTS.noiseSuppression && (
              <FormControlLabel
                control={
                  <Switch checked={noiseSuppression} onChange={ e => getLocalFeed(chosenAudioInput, chosenVideoInput, { echoCancellation, autoGainControl, noiseSuppression: e.target.checked }) } />
                }
                label="Enable Noise Suppression"
              />
            )
          }

          <Typography variant="h5">Other Settings</Typography>
          <FormControlLabel control={<Switch checked={isNerdy} onChange={ e => toggleNerdiness(e.target.checked) } />} label="Show Nerdy Stats"/>
          { typeof Notification !== 'undefined' && (
            <div>
              <FormControlLabel control={<Switch checked={wantsNotifications} onChange={ e => toggleNotifications(e.target.checked) } />} label="Use Notifications"/>
              {
                wantsNotifications && (Notification.permission === 'denied') && 
                <Typography variant="body1">
                  You've denied this site notification permissions, you'll need to change that in your browser settings to receive notifications.
                </Typography>
              }
              {
                wantsNotifications && (Notification.permission !== 'denied') && 
                <Button onClick={ () => new Notification(`Test Notification`, {
                    body: `If you can see and hear this, then your notifications are turned on.`,
                    // badge: 'static/touch-icon-iphone-retina.png',
                    // icon: 'static/touch-icon-iphone-retina.png',
                    silent: false
                })}>Send Test Notification</Button>
              }
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>OK</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

Settings.displayName = 'Settings';
Settings.propTypes = {};
Settings.defaultProps = {};

export default Settings;
