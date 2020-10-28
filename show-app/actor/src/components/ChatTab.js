import React from 'react';

import {
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography
} from '@material-ui/core';

import './chattab.scss';

class ChatTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newMessage: ''
    };

    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    const {
      messageList
    } = this.refs;
    messageList.scrollTop = messageList.scrollHeight;
  }

  componentDidUpdate(prevProps) {
    const {
      party,
      isVisible
    } = this.props;
    const {
      messageList
    } = this.refs;

    if ((isVisible && !prevProps.isVisble) || party.chat.length !== prevProps.party.chat.length) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }

  sendMessage() {
    const {
      actions: {
        sendChatMessage
      },
      party
    } = this.props;
    const {
      newMessage
    } = this.state;
    sendChatMessage(party._id, newMessage);
    this.setState({ newMessage: '' });
  }

  render() {
    const {
      party
    } = this.props;
    const {
      newMessage,
    } = this.state;
    return (
      <div className="chattab-component">
        <List className="tab-panel-list" ref="messageList">
          {
            party.chat.map(message => (
              <ListItem key={message._id}>
                <ListItemText
                  primary={message.content}
                  secondary={message.username}
                />
              </ListItem>
            ))
          }
        </List>
        <TextField
          className="tab-panel-field"
          label="New Message"
          value={newMessage}
          onChange={e => this.setState({ newMessage: e.target.value })}
          onKeyPress={e => (e.key === 'Enter') && this.sendMessage()}
        />
      </div>
    );
  }
}

ChatTab.displayName = 'ChatTab';
ChatTab.propTypes = {};
ChatTab.defaultProps = {};

export default ChatTab;
