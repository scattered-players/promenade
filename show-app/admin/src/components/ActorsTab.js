import React from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  List,
  TextField,
} from '@material-ui/core';

import Actor from './Actor';

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
      isShowingCreateActorDialog: false
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
    //  if(newActorEmail !== '' && newActorCharacterName !== '' && newActorPlaceName !== '' && newAssetKey !== '') {
    if(newActorEmail !== '' && newActorUsername !== '') {
      this.setState({
        newActorEmail: '',
        newActorUsername: '',
        // newActorCharacterName: '',
        // newActorPlaceName: '',
        // newFlavorText: '',
        // newAudioPath:'',
        // newAudioVolume: 0,
        // newAssetKey:''
      }, () => {
        createActor(newActorEmail, newActorUsername);
      });
    }
  }

  render() {
    const {
      actions,
      system
    } = this.props;
    const {
      actors,
      phases
    } = system;
    const {
      newActorEmail,
      newActorUsername,
      newActorCharacterName,
      newActorPlaceName,
      newFlavorText,
      newAudioPath,
      newAudioVolume,
      newAssetKey,
      isShowingCreateActorDialog,
      forceRefreshUser
    } = this.state;
    return (
      <>
        <div>
          <Button onClick={ () => this.setState({isShowingCreateActorDialog: true}) }>Create Actor</Button>
          <Dialog open={isShowingCreateActorDialog} onClose={() => this.setState({isShowingCreateActorDialog: false})}>
            <DialogContent className="create-actor-dialog">
              <TextField label="Email" value={newActorEmail} onChange={ e => this.setState({ newActorEmail: e.target.value }) }/>
              <TextField label="Username" value={newActorUsername} onChange={ e => this.setState({ newActorUsername: e.target.value }) }/>
              {/* <TextField label="Character Name" value={newActorCharacterName} onChange={ e => this.setState({ newActorCharacterName: e.target.value }) }/>
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
              </FormControl> */}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({isShowingCreateActorDialog: false}, this.createActor)}>CREATE</Button>
              <Button onClick={() => this.setState({isShowingCreateActorDialog: false})}>CANCEL</Button>
            </DialogActions>
          </Dialog>
        </div>
        <div>
          <List dense={true}>
            { actors.map(actor => <Actor key={actor._id} actor={actor} phases={phases} actions={actions} />) }
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
