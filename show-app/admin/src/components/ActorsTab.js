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

import './actorstab.scss';

class ActorsTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newActorEmail: '',
      newActorUsername: '',
      newActorCharacterName: '',
      newActorPlaceName: '',
      newFlavorText: '',
      newAudioPath: '',
      newAudioVolume: 0,
      newAssetKey: ASSET_KEYS[0],
      isShowingCreateDialog: false
    };

    this.createActor = this.createActor.bind(this);
  }

  createActor() {
    const { actions } = this.props;
    const { createActor } = actions;
    const { 
      newActorEmail,
      newActorUsername,
      newActorCharacterName,
      newActorPlaceName,
      newFlavorText,
      newAudioPath,
      newAudioVolume,
      newAssetKey
     } = this.state;
    if(newActorEmail !== '' && newActorCharacterName !== '' && newActorPlaceName !== '' && newAssetKey !== '') {
      this.setState({
        newActorEmail: '',
        newActorUsername: '',
        newActorCharacterName: '',
        newActorPlaceName: '',
        newFlavorText: '',
        newAudioPath:'',
        newAudioVolume: 0,
        newAssetKey:''
      }, () => {
        createActor(newActorEmail, newActorUsername, newActorCharacterName, newActorPlaceName, newFlavorText, newAudioPath, newAudioVolume, newAssetKey);
      });
    }
  }

  render() {
    const {
      actions,
      system
    } = this.props;
    const {
      getMagicLink,
      kickParty,
      deleteActor
    } = actions;
    const { actors } = system;
    const {
      newActorEmail,
      newActorUsername,
      newActorCharacterName,
      newActorPlaceName,
      newFlavorText,
      newAudioPath,
      newAudioVolume,
      newAssetKey,
      isShowingCreateDialog,
      forceRefreshUser
    } = this.state;
    return (
      <>
        <div>
          <Button onClick={ () => this.setState({isShowingCreateDialog: true}) }>Create Actor + Place</Button>
          <Dialog open={isShowingCreateDialog} onClose={() => this.setState({isShowingCreateDialog: false})}>
            <DialogContent className="create-actor-dialog">
              <TextField label="Email" value={newActorEmail} onChange={ e => this.setState({ newActorEmail: e.target.value }) }/>
              <TextField label="Username" value={newActorUsername} onChange={ e => this.setState({ newActorUsername: e.target.value }) }/>
              <TextField label="Character Name" value={newActorCharacterName} onChange={ e => this.setState({ newActorCharacterName: e.target.value }) }/>
              <TextField label="Place Name" value={newActorPlaceName} onChange={ e => this.setState({ newActorPlaceName: e.target.value }) }/>
              <TextField label="Flavor Text" value={newFlavorText} onChange={ e => this.setState({ newFlavorText: e.target.value }) }/>
              <TextField label="Audio Path" value={newAudioPath} onChange={ e => this.setState({ newAudioPath: e.target.value }) }/>
              <TextField label="Audio Volume" value={newAudioVolume} onChange={ e => this.setState({ newAudioVolume: e.target.value }) } type="number"/>
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
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({isShowingCreateDialog: false}, this.createActor)}>CREATE</Button>
              <Button onClick={() => this.setState({isShowingCreateDialog: false})}>CANCEL</Button>
            </DialogActions>
          </Dialog>
        </div>
        <div>
          <List dense={true}>
            {
              actors.map(actor => {
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
                        <Badge badgeContent="!" color="error"/>
                        <VideocamOffIcon />
                      </span>
                    </Tooltip>
                  ) : (
                    actor.isVideoMuted ? <VideocamOffIcon /> : <VideocamIcon />
                  );
                return (
                  <ListItem key={actor._id} className="actor-list-item">
                    <div className="actor-headline">
                      <div className={ 'actor-status-indicator ' + (actor.isOnline ? (actor.place.isAvailable ? 'ready' : 'not-ready') : 'not-online')}></div>
                      <ListItemText 
                        primary={actor.username}
                        secondary={actor.place.characterName + ' @ ' + actor.place.placeName}
                        className="actor-list-item-text"
                      />
                      <div className="attendee-icons">
                        <div className="attendee-icon-wrapper">
                          { audioIndicator }
                        </div>
                        <div className="attendee-icon-wrapper">
                          { videoIndicator }
                        </div>
                        <div className="attendee-icon-wrapper">
                          <IconButton onClick={() => forceRefreshUser(actor._id)}>
                            <RefreshIcon />
                          </IconButton>
                        </div>
                      </div>
                      <Button onClick={()=> getMagicLink(actor._id)}>Get Link</Button>
                      <Typography variant="body1">{actor.currentBrowser}</Typography>
                      <IconButton onClick={() => deleteActor(actor._id)}>
                        <ClearIcon />
                      </IconButton>
                    </div>
                    {
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
                    }
                  </ListItem>
                  )
              })
            }
          </List>
        </div>
      </>
    );
  }
}

ActorsTab.displayName = 'ActorsTab';
ActorsTab.propTypes = {};
ActorsTab.defaultProps = {};

export default ActorsTab;
