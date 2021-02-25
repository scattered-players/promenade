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

import './bot.scss';

class Bot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newCharacterName: '',
      newPlaceName: '',
      newFlavorText: '',
      newBotURL: '',
      newBotTime: 0,
      newAssetKey: ASSET_KEYS[0],
      isShowingCreatePlaceDialog: false
    };

    this.createPlace = this.createPlace.bind(this);
  }

  createPlace() {
    const { bot, actions } = this.props;
    const { createBotPlace } = actions;
    const {
      newCharacterName,
      newPlaceName,
      newFlavorText,
      newAssetKey,
      newBotURL,
      newBotTime
    } = this.state;
    if (newCharacterName !== '' && newPlaceName !== '' && newAssetKey !== '' && newBotURL !== '') {
      this.setState({
        newCharacterName: '',
        newPlaceName: '',
        newFlavorText: '',
        newBotURL: '',
        newBotTime: 0,
        newAssetKey: ''
      }, () => {
        createBotPlace(bot._id, newCharacterName, newPlaceName, newFlavorText, newAssetKey, newBotURL, newBotTime);
      });
    }
  }

  render() {
    const {
      bot,
      actions: {
        toggleBot,
        deleteBot,
        deleteBotPlace
      }
    } = this.props;
    const {
      newCharacterName,
      newPlaceName,
      newFlavorText,
      newAssetKey,
      newBotURL,
      newBotTime,
      isShowingCreatePlaceDialog
    } = this.state;
    return (
      <ListItem className="bot-list-item" alignItems="flex-start">
        <div className="bot-headline">
          <div className={'actor-status-indicator ' + (bot.isOnline ? (bot.isAvailable ? 'ready' : 'not-ready') : 'not-online')} onClick={() => toggleBot(bot._id, !bot.isOnline)}></div>
          <ListItemText
            primary={bot.username}
            className="bot-list-item-text"
          />
          <IconButton onClick={() => deleteBot(bot._id)}>
            <ClearIcon />
          </IconButton>
          <Button onClick={ () => this.setState({isShowingCreatePlaceDialog: true}) }>Create Place</Button>
        </div>
        <Dialog open={isShowingCreatePlaceDialog} onClose={() => this.setState({isShowingCreatePlaceDialog: false})}>
          <DialogContent className="create-place-dialog">
            <TextField label="Character Name" value={newCharacterName} onChange={ e => this.setState({ newCharacterName: e.target.value }) }/>
            <TextField label="Place Name" value={newPlaceName} onChange={ e => this.setState({ newPlaceName: e.target.value }) }/>
            <TextField label="Flavor Text" value={newFlavorText} onChange={ e => this.setState({ newFlavorText: e.target.value }) }/>
            <TextField label="Bot Video URL" value={newBotURL} onChange={ e => this.setState({ newBotURL: e.target.value }) }/>
            <TextField label="Bot Video Duration" type="number" value={newBotTime} onChange={ e => this.setState({ newBotTime: e.target.value }) }/>
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
            <Button onClick={() => this.setState({isShowingCreatePlaceDialog: false}, this.createPlace)}>CREATE</Button>
            <Button onClick={() => this.setState({isShowingCreatePlaceDialog: false})}>CANCEL</Button>
          </DialogActions>
        </Dialog>
        <List dense={true}>
          {
            bot.places.map(place => {
              return (
                <ListItem key={place._id} alignItems="flex-start">
                  <ListItemText 
                    style={{ flexGrow: 0}}
                    primary={place.characterName}
                    secondary={place.placeName}
                  />
                  <IconButton onClick={() => deleteBotPlace(bot._id, place._id)}>
                    <ClearIcon />
                  </IconButton>
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
    );
  }
}

Bot.displayName = 'Bot';
Bot.propTypes = {};
Bot.defaultProps = {};

export default Bot;
