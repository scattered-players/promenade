import React from 'react';

import {
  Button,
  Paper
} from '@material-ui/core';

import phaseKindsEnum from '../enum/phasesKinds';

import './phase.scss';

class Phase extends React.Component {

  render() {
    const {
      phase,
      actions: {
        deletePhase
      }
    } = this.props;

    let phaseComponent = (<div />);
    switch(phase.kind) {
      case phaseKindsEnum.WEB_PAGE:
      case phaseKindsEnum.STATIC_VIDEO:
      case phaseKindsEnum.LIVESTREAM:
        phaseComponent = (<div>{phase.attributes.url}</div>);
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
        <h3>{phase.name} ({phase.kind}) <Button onClick={ () => deletePhase(phase._id)}>Delete</Button></h3>
        { phaseComponent }
      </Paper>
    );
  }
}

Phase.displayName = 'Phase';
Phase.propTypes = {};
Phase.defaultProps = {};

export default Phase;
