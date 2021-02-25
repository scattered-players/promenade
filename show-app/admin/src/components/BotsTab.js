import React from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  List,
  TextField,
} from '@material-ui/core';

import Bot from './Bot';

import './botstab.scss';

class BotsTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newBotUsername: '',
      isShowingCreateBotDialog: false
    };

    this.createBot = this.createBot.bind(this);
  }

  createBot() {
    const { actions } = this.props;
    const { createBot } = actions;
    const { 
      newBotUsername,
     } = this.state;
    if(newBotUsername !== '') {
      this.setState({
        newBotUsername: '',
      }, () => {
        createBot(newBotUsername);
      });
    }
  }

  render() {
    const {
      actions,
      system
    } = this.props;
    const {
      bots
    } = system;
    const {
      newBotUsername,
      isShowingCreateBotDialog
    } = this.state;
    return (
      <>
        <div>
          <Button onClick={ () => this.setState({isShowingCreateBotDialog: true}) }>Create Bot</Button>
          <Dialog open={isShowingCreateBotDialog} onClose={() => this.setState({isShowingCreateBotDialog: false})}>
            <DialogContent className="create-bot-dialog">
              <TextField label="Username" value={newBotUsername} onChange={ e => this.setState({ newBotUsername: e.target.value }) }/>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({isShowingCreateBotDialog: false}, this.createBot)}>CREATE</Button>
              <Button onClick={() => this.setState({isShowingCreateBotDialog: false})}>CANCEL</Button>
            </DialogActions>
          </Dialog>
        </div>
        <div>
          <List dense={true}>
            { bots.map(bot => <Bot key={bot._id} bot={bot} actions={actions} />) }
          </List>
        </div>
      </>
    );
  }
}

BotsTab.displayName = 'BotsTab';
BotsTab.propTypes = {};
BotsTab.defaultProps = {};

export default BotsTab;
