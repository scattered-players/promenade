import React from 'react';
import config from 'config';

import {
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  TextField
} from '@material-ui/core';

import phaseKindsEnum from '../enum/phasesKinds';

import WebpageScreen from './WebpageScreen';
import IntroScreen from './IntroScreen';
import NavigationScreen from './NavigationScreen';
import InteractionScreen from './InteractionScreen';
import HistoryTab from './HistoryTab';
import NotesTab from './NotesTab';
import VideoRow from './VideoRow';
import Settings from './Settings';
import EndingScreen from './EndingScreen';
import KickScreen from './KickScreen';


import './partysidebar.scss';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  let style = {};
  if(value !== index) {
    style.display = 'none';
  }
  return (
    <div
      role="tabpanel"
      style={style}
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      { children }
    </div>
  );
}

class PartySidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newMessage: '',
      isSettingsDisplayed: false,
      isAudioDialOpen: false,
      isVideoDialOpen: false,
      currentTab: 0
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
      chatMessages
    } = this.props;
    const {
      messageList
    } = this.refs;
    if(!prevProps.chatMessages || chatMessages.length !== prevProps.chatMessages.length){
      messageList.scrollTop = messageList.scrollHeight;
    }
  }

  sendMessage() {
    const {
      actions: {
        sendChatMessage
      },
      system: {
        myParty
      }
    } = this.props;
    const {
      newMessage
    } = this.state;
    sendChatMessage(myParty._id, newMessage);
    this.setState({ newMessage: '' });
  }

  render() {
    const {
      system,
      actions
    } = this.props,
    {
      myParty,
      chatMessages,
      user
    } = system;
    const { decider } = myParty;
    const {
      newMessage,
      isSettingsDisplayed,
      currentTab
    } = this.state;
    const screenDict = {
      [phaseKindsEnum.WEB_PAGE]: WebpageScreen,
      // [showStatusEnum.INTRO]: IntroScreen,
      // [showStatusEnum.FREEPLAY]: myParty.currentPlace  ? InteractionScreen : NavigationScreen,
      // [showStatusEnum.ENDING]: EndingScreen,
      [phaseKindsEnum.KICK]: KickScreen,
    };
    const CurrentScreen = screenDict[system.currentShow.currentPhase.kind];
    return (
      <div className="partysidebar-component">
        { config.IS_MOBILE && system.currentShow.currentPhase.kind === phaseKindsEnum.STATIC_VIDEO && <IntroScreen /> }
        { config.IS_MOBILE && system.currentShow.currentPhase.kind === phaseKindsEnum.VIDEO_CHOICE && <EndingScreen /> }
        <Tabs
          className="tabs"
          value={currentTab}
          onChange={(e, currentTab) => this.setState({ currentTab })}
          variant="fullWidth"
        >
          { config.IS_MOBILE && <Tab className="tab" label="Scene"  /> }
          { config.IS_MOBILE && <Tab className="tab" label="Party"  /> }
          <Tab className="tab" label="Chat" />
          <Tab className="tab" label="Items" />
          <Tab className="tab" label="History" />
          <Tab className="tab" label="Notes" />
        </Tabs>
        {
          config.IS_MOBILE &&
            <TabPanel value={currentTab} index={0} className="tab-panel">
              {
                system.currentShow.currentPhase.kind !== phaseKindsEnum.STATIC_VIDEO && system.currentShow.currentPhase.kind !== phaseKindsEnum.VIDEO_CHOICE && <CurrentScreen actions={actions} system={system}/>
              }
            </TabPanel>
        }
        {
          config.IS_MOBILE &&
            <TabPanel value={currentTab} index={1} className="tab-panel">
              <VideoRow system={system} actions={actions} />
            </TabPanel>
        }
        <TabPanel value={currentTab} index={config.IS_MOBILE ? 2 : 0} className="tab-panel">
          <List className="tab-panel-list" ref="messageList">
            {
              chatMessages.map(message => (
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
        </TabPanel>
        <TabPanel value={currentTab} index={config.IS_MOBILE ? 3 : 1} className="tab-panel">
          <List className="tab-panel-list">
            {
              myParty.inventory.filter(a => a).map(item => (
                <ListItem key={item._id}>
                  <ListItemText
                    primary={item.name}
                  />
                </ListItem>
              ))
            }
          </List>
        </TabPanel>
        <TabPanel value={currentTab} index={config.IS_MOBILE ? 4 : 2} className="tab-panel">
          <HistoryTab party={myParty} actions={actions} />
        </TabPanel>
        <TabPanel value={currentTab} index={config.IS_MOBILE ? 5 : 3} className="tab-panel">
          <NotesTab party={myParty} actions={actions} />
        </TabPanel>
        { config.IS_MOBILE && isSettingsDisplayed && <Settings system={system} actions={actions} onClose={()=>this.setState({isSettingsDisplayed: false})} /> }
      </div>
    );
  }
}

PartySidebar.displayName = 'PartySidebar';
PartySidebar.propTypes = {};
PartySidebar.defaultProps = {};

export default PartySidebar;
