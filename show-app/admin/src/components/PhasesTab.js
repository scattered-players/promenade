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
      newPhaseKind: phaseKindsEnum.WEB_PAGE,
      newPhaseAttributes: {},
      isShowingCreateDialog: false
    };

    this.createPhase = this.createPhase.bind(this);
    this.movePhaseDown = this.movePhaseDown.bind(this);
    this.movePhaseUp = this.movePhaseUp.bind(this);
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
        newPhaseKind: phaseKindsEnum.WEB_PAGE,
        newPhaseAttributes: {}
      }, () => {
        createPhase(newPhaseName, newPhaseKind,newPhaseAttributes);
      });
    }
  }

  movePhaseDown(index) {
    const {
      actions: {
        swapPhases
      },
      system: {
        phases
      }
    } = this.props;
    if (index < phases.length-1){
      swapPhases(phases[index], phases[index+1]);
    }
  }

  movePhaseUp(index) {
    const {
      actions: {
        swapPhases
      },
      system: {
        phases
      }
    } = this.props;
    if (index > 0){
      swapPhases(phases[index], phases[index-1]);
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
                (newPhaseKind === phaseKindsEnum.WEB_PAGE || newPhaseKind === phaseKindsEnum.STATIC_VIDEO) &&
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
              {
                (newPhaseKind === phaseKindsEnum.FREEPLAY) &&
                <div>
                  <TextField
                    label="Navigation Worker Name"
                    value={newPhaseAttributes.navWorkerName || ''}
                    onChange={ e =>  this.setState({ newPhaseAttributes: { navWorkerName: e.target.value } })}/>
                  <TextField
                    label="Background Music URL"
                    value={newPhaseAttributes.backgroundMusicUrl || ''}
                    onChange={ e =>  this.setState({ newPhaseAttributes: { backgroundMusicUrl: e.target.value } })}/>
                  <TextField
                    label="Overlay Video URL"
                    value={newPhaseAttributes.overlayVideoUrl || ''}
                    onChange={ e =>  this.setState({ newPhaseAttributes: { overlayVideoUrl: e.target.value } })}/>
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
            phases.map(phase => <Phase phase={phase} actions={actions} key={phase._id} movePhaseDown={this.movePhaseDown} movePhaseUp={this.movePhaseUp} />)
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
