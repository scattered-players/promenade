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

import Phase from './Phase';
import phaseKindsEnum from '../enum/phasesKinds';
const PHASE_KINDS = Object.keys(phaseKindsEnum);

import './phasestab.scss';

class PhasesTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newPhaseName: '',
      newPhaseKind: phaseKindsEnum.GUIDE_INTERACTION,
      newPhaseAttributes: {},
      isShowingCreateDialog: false
    };

    this.createPhase = this.createPhase.bind(this);
  }

  createPhase() {
    const {
      actions: {
        createPhase
      }
    } = this.props;
    const { 
      newPhaseName,
      newPhaseKind,
      newPhaseAttributes
     } = this.state;
    if(newPhaseName !== '') {
      this.setState({
        newPhaseName: '',
        newPhaseKind: phaseKindsEnum.GUIDE_INTERACTION,
        newPhaseAttributes: {}
      }, () => {
        createPhase(newPhaseName, newPhaseKind,newPhaseAttributes);
      });
    }
  }

  render() {
    const {
      actions,
      system: {
        phases
      }
    } = this.props;
    const {
      newPhaseName,
      newPhaseKind,
      newPhaseAttributes,
      isShowingCreateDialog
    } = this.state;
    return (
      <div className="phasestab-component">
        <div>
          <Button onClick={ () => this.setState({isShowingCreateDialog: true}) }>Create Phase</Button>
          <Dialog open={isShowingCreateDialog} onClose={() => this.setState({isShowingCreateDialog: false})}>
            <DialogContent className="create-phase-dialog">
              <TextField label="Name" value={newPhaseName} onChange={ e => this.setState({ newPhaseName: e.target.value }) }/>
              <FormControl >
                <InputLabel id={`phase-kind-select`}>Phase Kind</InputLabel>
                <Select
                  labelId={`phase-kind-select`}
                  value={newPhaseKind}
                  onChange={e => this.setState({ newPhaseKind: e.target.value, newPhaseAttributes: {} })}
                >
                  {PHASE_KINDS.map(phaseKind => <MenuItem key={phaseKind} value={phaseKind}>{phaseKind}</MenuItem>)}
                </Select>
              </FormControl>
              {
                (newPhaseKind === phaseKindsEnum.WEB_PAGE || newPhaseKind === phaseKindsEnum.STATIC_VIDEO || newPhaseKind === phaseKindsEnum.LIVESTREAM) &&
                <div>
                  <TextField label="Url" value={newPhaseAttributes.url || ''} onChange={ e => this.setState({ newPhaseAttributes: { url: e.target.value } }) }/>
                </div>
              }
              {
                (newPhaseKind === phaseKindsEnum.VIDEO_CHOICE) &&
                <div>
                  {
                    (newPhaseAttributes.videoList || []).map((videoChoice, i) => (
                      <div key={i}>
                        <TextField label="Url" value={videoChoice} onChange={ e => {
                          const newVideoList = [...newPhaseAttributes.videoList];
                          newVideoList[i] = e.target.value;
                          this.setState({ newPhaseAttributes: { videoList: newVideoList } });
                        }}/>
                      </div>
                    ))
                  }
                  <Button onClick={ () => {
                    const newVideoList = [...(newPhaseAttributes.videoList || [])];
                    newVideoList.push('');
                    this.setState({ newPhaseAttributes: { videoList: newVideoList } });
                  }}>
                    Add Choice
                  </Button>
                </div>
              }
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({isShowingCreateDialog: false}, this.createPhase)}>CREATE</Button>
              <Button onClick={() => this.setState({isShowingCreateDialog: false})}>CANCEL</Button>
            </DialogActions>
          </Dialog>
        </div>
        <div className="phase-list">
          {
            phases.map(phase => <Phase phase={phase} actions={actions} key={phase._id} />)
          }
        </div>
      </div>
    );
  }
}

PhasesTab.displayName = 'PhasesTab';
PhasesTab.propTypes = {};
PhasesTab.defaultProps = {};

export default PhasesTab;
