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
     } = this.state;
    if(newActorEmail !== '' && newActorUsername !== '') {
      this.setState({
        newActorEmail: '',
        newActorUsername: '',
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
      isShowingCreateActorDialog
    } = this.state;

    const freeplayPhases = phases.filter(phase => phase.kind === 'FREEPLAY');

    return (
      <>
        <div>
          <Button onClick={ () => this.setState({isShowingCreateActorDialog: true}) }>Create Actor</Button>
          <Dialog open={isShowingCreateActorDialog} onClose={() => this.setState({isShowingCreateActorDialog: false})}>
            <DialogContent className="create-actor-dialog">
              <TextField label="Email" value={newActorEmail} onChange={ e => this.setState({ newActorEmail: e.target.value }) }/>
              <TextField label="Username" value={newActorUsername} onChange={ e => this.setState({ newActorUsername: e.target.value }) }/>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({isShowingCreateActorDialog: false}, this.createActor)}>CREATE</Button>
              <Button onClick={() => this.setState({isShowingCreateActorDialog: false})}>CANCEL</Button>
            </DialogActions>
          </Dialog>
        </div>
        <div>
          <List dense={true}>
            { actors.map(actor => <Actor key={actor._id} actor={actor} freeplayPhases={freeplayPhases} actions={actions} />) }
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
