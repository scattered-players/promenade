import React from 'react';

import {
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  Paper
} from '@material-ui/core';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import phaseKindsEnum from '../enum/phasesKinds';

import './phase.scss';

class Phase extends React.Component {
  constructor(props){
    super(props);

    this.handleDefaultCheck = this.handleDefaultCheck.bind(this);
  }

  handleDefaultCheck(e) {
    if(e.target.checked) {
      const {
        phase,
        actions: {
          setDefaultPhase,
        }
      } = this.props;

      setDefaultPhase(phase);
    }
  }

  render() {
    const {
      phase,
      actions: {
        deletePhase
      },
      movePhaseDown,
      movePhaseUp
    } = this.props;

    let phaseComponent = (<div />);
    switch(phase.kind) {
      case phaseKindsEnum.WEB_PAGE:
      case phaseKindsEnum.STATIC_VIDEO:
      case phaseKindsEnum.LIVESTREAM:
        phaseComponent = (<div><strong>URL:</strong> {phase.attributes.url}</div>);
        break;
      case phaseKindsEnum.VIDEO_CHOICE:
        phaseComponent = (
          <div>
            {
              phase.attributes.videoList.map((videoChoice, i) => <div key={i}>{videoChoice}</div>)
            }
          </div>
        );
        break;
    }

    return (
      <Paper className="phase-component">
        <ButtonGroup orientation="vertical" className="swap-buttons">
          <IconButton onClick={ () => movePhaseUp(phase.index)}>
            <ArrowUpwardIcon />
          </IconButton>
          <IconButton onClick={ () => movePhaseDown(phase.index)}>
            <ArrowDownwardIcon />
          </IconButton>
        </ButtonGroup>
        <div className="main-phase-area">
          <h3>#{phase.index+1} {phase.name} <Chip label={phase.kind} /> <Button onClick={ () => deletePhase(phase._id)}>Delete</Button></h3>
          <FormControlLabel
            control={<Checkbox checked={phase.isDefault} onChange={ this.handleDefaultCheck } name={`${phase._id}isDefault`} />}
            label="Default Phase"
          />
          { phaseComponent }
        </div>
      </Paper>
    );
  }
}

Phase.displayName = 'Phase';
Phase.propTypes = {};
Phase.defaultProps = {};

export default Phase;
