import React from 'react';

import {
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography
} from '@material-ui/core';

import './inventorytab.scss';

class InventoryTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newItem: ''
    };

    this.giveItem = this.giveItem.bind(this);
    this.takeItem = this.takeItem.bind(this);
  }

  giveItem() {
    const {
      actions: {
        sendChatMessage,
        giveItem
      },
      system: {
        myPlace
      },
      party
    } = this.props;
    const {
      newItem
    } = this.state;
    sendChatMessage(party._id, `${myPlace.characterName} gave ${newItem}`);
    giveItem(party._id, newItem);
    this.setState({ newItem: '' });
  }

  takeItem(item) {
    const {
      actions: {
        sendChatMessage,
        takeItem
      },
      system: {
        myPlace
      },
      party
    } = this.props;
    sendChatMessage(party._id, `${myPlace.characterName} took ${item.name}`);
    takeItem(party._id, item._id);
  }

  render() {
    const {
      actions: {
        takeItem
      },
      party
    } = this.props;
    const {
      newItem
    } = this.state;
    return (
      <div className="inventorytab-component">
        <List className="tab-panel-list">
          {
            party.inventory.filter(a => a).map(item => (
              <ListItem key={item._id}>
                <ListItemText
                  primary={item.name}
                />
                <Button onClick={() => this.takeItem(item)}>Take</Button>
              </ListItem>
            ))
          }
        </List>
        <TextField
          className="tab-panel-field"
          label="Give New Item"
          value={newItem}
          onChange={e => this.setState({ newItem: e.target.value })}
          onKeyPress={e => (e.key === 'Enter') && this.giveItem()}
        />
      </div>
    );
  }
}

InventoryTab.displayName = 'InventoryTab';
InventoryTab.propTypes = {};
InventoryTab.defaultProps = {};

export default InventoryTab;
