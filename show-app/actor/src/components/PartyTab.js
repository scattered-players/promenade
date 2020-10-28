import React from 'react';

import {
  Button,
  IconButton,
  MenuList,
  MenuItem,
  Typography
} from '@material-ui/core';

import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import ClearIcon from '@material-ui/icons/Clear';

import './partytab.scss';

class PartyTab extends React.Component {

  render() {
    const { actions, system } = this.props,
    {
      setReadyFlag,
      acceptParty,
      previewParty,
      kickParty
    } = actions,
    {
      myPlace,
      currentParty
    } = system;
    return (
      <div className="partytab-component">
        { myPlace.isAvailable && <Button onClick={ () => setReadyFlag(myPlace._id, false)}>I'M NOT READY, HIDE ME!</Button>}
        { 
          currentParty && (
            <>
              <Typography style={{backgroundColor: currentParty.color, textShadow:'0px 0px 5px black'}}>{ `Current Party: ${currentParty.name}` }</Typography>
              <Button onClick={() => kickParty(currentParty._id, myPlace._id)}>Kick</Button>
            </>
          )
        }
        <Typography>Party Queue</Typography>
        <MenuList>
          {
            myPlace.partyQueue.map(party => (
              <MenuItem style={{backgroundColor: party.color, textShadow:'0px 0px 5px black'}} key={party._id} onClick={() => acceptParty(party._id, myPlace._id)}>
                {party.name}
                <IconButton onClick={e => { previewParty(party._id); e.stopPropagation();}}>
                  <RemoveRedEyeIcon />
                </IconButton>
                <IconButton onClick={e => { kickParty(party._id, myPlace._id); e.stopPropagation();}}>
                  <ClearIcon />
                </IconButton>
              </MenuItem>
            ))
          }
        </MenuList>
      </div>
    );
  }
}

PartyTab.displayName = 'PartyTab';
PartyTab.propTypes = {};
PartyTab.defaultProps = {};

export default PartyTab;
