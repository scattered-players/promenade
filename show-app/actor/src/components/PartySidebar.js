import React from 'react';
import config from 'config';

import {
  Tab,
  Tabs
} from '@material-ui/core';
import WorkIcon from '@material-ui/icons/Work';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import HistoryIcon from '@material-ui/icons/History';

import ChatTab from './ChatTab';
import InventoryTab from './InventoryTab';
import HistoryTab from './HistoryTab';

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
      currentTab: 0
    };
  }

  render() {
    const {
      system,
      actions,
      party
    } = this.props;
    const {
      currentTab
    } = this.state;
    return (
      <div className="partysidebar-component">
        <Tabs
          className="tabs"
          value={currentTab}
          onChange={(e, currentTab) => this.setState({ currentTab })}
          variant={ config.IS_MOBILE ? "scrollable" : "fullWidth" }
        >
          <Tab className="tab" label="Chat" />
          <Tab className="tab" label="Items"/>
          <Tab className="tab" label="History" />
        </Tabs>
        <TabPanel value={currentTab} index={0} className="tab-panel">
          <ChatTab system={system} actions={actions} party={party} />
        </TabPanel>
        <TabPanel value={currentTab} index={1} className="tab-panel">
          <InventoryTab system={system} actions={actions} party={party} />
        </TabPanel>
        <TabPanel value={currentTab} index={2} className="tab-panel">
          <HistoryTab system={system} actions={actions} party={party} />
        </TabPanel>
      </div>
    );
  }
}

PartySidebar.displayName = 'PartySidebar';
PartySidebar.propTypes = {};
PartySidebar.defaultProps = {};

export default PartySidebar;
