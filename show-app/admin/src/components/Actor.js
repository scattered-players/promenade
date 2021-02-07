import React from 'react';

import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  IconButton,
} from '@material-ui/core';

import ClearIcon from '@material-ui/icons/Clear';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import RefreshIcon from '@material-ui/icons/Refresh';

import assetKeyEnum from 'custom/assetKey';
const ASSET_KEYS = Object.keys(assetKeyEnum);

import './actor.scss';

class Actor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newCharacterName: '',
      newPlaceName: '',
      newFlavorText: '',
      newAudioPath: '',
      newAssetKey: ASSET_KEYS[0],
      isShowingCreatePlaceDialog: false,
      newPlacePhase: ''
    };

    this.createPlace = this.createPlace.bind(this);
  }

  createPlace() {
    const { actor, actions, phases } = this.props;
    const { createPlace } = actions;
    const {
      newCharacterName,
      newPlaceName,
      newFlavorText,
      newAudioPath,
      newAssetKey,
      newPlacePhase
    } = this.state;
    if (newCharacterName !== '' && newPlaceName !== '' && newAssetKey !== '' && newPlacePhase !== '') {
      this.setState({
        newCharacterName: '',
        newPlaceName: '',
        newFlavorText: '',
        newAudioPath: '',
        newAssetKey: '',
        newPlacePhase: ''
      }, () => {
        createPlace(actor._id, newCharacterName, newPlaceName, newFlavorText, newAudioPath, newAssetKey, newPlacePhase);
      });
    }
  }

  render() {
    const { actor, actions, phases } = this.props;

    const audioIndicator = actor.audioError
      ? (
        <Tooltip title={`AUDIO ERROR: ${actor.audioError}`}>
          <span>
            <Badge badgeContent="!" color="error" />
            <MicOffIcon />
          </span>
        </Tooltip>
      ) : (
        actor.isAudioMuted ? <MicOffIcon /> : <MicIcon />
      );

    const videoIndicator = actor.videoError
      ? (
        <Tooltip title={`VIDEO ERROR: ${actor.videoError}`}>
          <span>
            <Badge badgeContent="!" color="error" />
            <VideocamOffIcon />
          </span>
        </Tooltip>
      ) : (
        actor.isVideoMuted ? <VideocamOffIcon /> : <VideocamIcon />
      );

    const freeplayPhases = phases.filter(phase => phase.kind === 'FREEPLAY');
    
    const {
      newCharacterName,
      newPlaceName,
      newFlavorText,
      newAudioPath,
      newAssetKey,
      newPlacePhase,
      isShowingCreatePlaceDialog
    } = this.state;
    return (
      <ListItem key={actor._id} className="actor-list-item">
        <div className="actor-headline">
          <div className={'actor-status-indicator ' + (actor.isOnline ? (actor.isAvailable ? 'ready' : 'not-ready') : 'not-online')}></div>
          <ListItemText
            primary={actor.username}
            className="actor-list-item-text"
          />
          <div className="attendee-icons">
            <div className="attendee-icon-wrapper">
              {audioIndicator}
            </div>
            <div className="attendee-icon-wrapper">
              {videoIndicator}
            </div>
            <div className="attendee-icon-wrapper">
              <IconButton onClick={() => forceRefreshUser(actor._id)}>
                <RefreshIcon />
              </IconButton>
            </div>
          </div>
          <Button onClick={() => getMagicLink(actor._id)}>Get Link</Button>
          <Typography variant="body1">{actor.currentBrowser}</Typography>
          <IconButton onClick={() => deleteActor(actor._id)}>
            <ClearIcon />
          </IconButton>
          <Button onClick={ () => this.setState({isShowingCreatePlaceDialog: true}) }>Create Place</Button>
        </div>
        <Dialog open={isShowingCreatePlaceDialog} onClose={() => this.setState({isShowingCreatePlaceDialog: false})}>
          <DialogContent className="create-place-dialog">
            <TextField label="Character Name" value={newCharacterName} onChange={ e => this.setState({ newCharacterName: e.target.value }) }/>
            <TextField label="Place Name" value={newPlaceName} onChange={ e => this.setState({ newPlaceName: e.target.value }) }/>
            <TextField label="Flavor Text" value={newFlavorText} onChange={ e => this.setState({ newFlavorText: e.target.value }) }/>
            <TextField label="Audio Path" value={newAudioPath} onChange={ e => this.setState({ newAudioPath: e.target.value }) }/>
            <FormControl >
              <InputLabel id={`asset-key-select`}>Asset Name</InputLabel>
              <Select
                labelId={`asset-key-select`}
                value={newAssetKey}
                onChange={e => this.setState({ newAssetKey: e.target.value })}
              >
                {ASSET_KEYS.map(assetKey => <MenuItem key={assetKey} value={assetKey}>{assetKey}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl >
              <InputLabel id={`phase-select`}>Phase</InputLabel>
              <Select
                labelId={`phase-select`}
                value={newPlacePhase}
                onChange={e => this.setState({ newPlacePhase: e.target.value })}
              >
                {freeplayPhases.map(phase => <MenuItem key={phase._id} value={phase._id}>{phase.name}</MenuItem>)}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({isShowingCreatePlaceDialog: false}, this.createPlace)}>CREATE</Button>
            <Button onClick={() => this.setState({isShowingCreatePlaceDialog: false})}>CANCEL</Button>
          </DialogActions>
        </Dialog>
        <List dense={true}>
          {
            actor.places.map(place => {
              return (
                <ListItem key={place._id}>
                  <ListItemText 
                    primary={place.characterName}
                    secondary={place.placeName}
                  />
                </ListItem>
              )
            })
          }

        </List>
        {/* {
        !!actor.place.currentParty &&
        <div className="current-party-wrapper">
          <Typography>Current Party</Typography>
          <List dense={true}>
            <ListItem style={{backgroundColor: actor.place.currentParty.color, textShadow:'0px 0px 5px black'}}>
              <ListItemText 
                primary={actor.place.currentParty.name}
              />
              <IconButton onClick={() => kickParty(actor.place.currentParty._id, actor.place._id)}>
                <ClearIcon />
              </IconButton>
            </ListItem>
          </List>
        </div>
      }
      {
        !!actor.place.partyQueue.length &&
        <div className="party-queue-wrapper">
          <Typography>Queue</Typography>
          <List dense={true}>
            {actor.place.partyQueue.map(party => (
              <ListItem key={party._id} style={{backgroundColor: party.color, textShadow:'0px 0px 5px black'}}>
                <ListItemText 
                  primary={party.name}
                />
                <IconButton onClick={() => kickParty(party._id, actor.place._id)}>
                  <ClearIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </div>
      } */}
      </ListItem>
    )
  }
}

Actor.displayName = 'Actor';
Actor.propTypes = {};
Actor.defaultProps = {};

export default Actor;
