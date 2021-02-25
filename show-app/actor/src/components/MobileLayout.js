import React from 'react';
import config from 'config';

import {
  Badge,
  Tab,
  Tabs
} from '@material-ui/core';
import WorkIcon from '@material-ui/icons/Work';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import HistoryIcon from '@material-ui/icons/History';

import FilterTab from './FilterTab';
import PartyTab from './PartyTab';
import PlaceTab from './PlaceTab';
import PerformanceScreen from './PerformanceScreen';
import VideoRow from './VideoRow';
import ChatTab from './ChatTab';
import InventoryTab from './InventoryTab';
import HistoryTab from './HistoryTab';

import './mobilelayout.scss';

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

class MobileLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 3
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      system: {
        currentParty
      }
    } = this.props;
    const {
      currentTab,
    } = this.state;


    if(currentTab > 3 && !currentParty){
      this.setState({currentTab: 0});
    }

  }

  render() {
    const {
      system,
      actions,
      party
    } = this.props,
    {
      myCurrentPlace,
      previewedParty,
      currentParty,
      localInputStream,
      localOutputStream
    } = system;
    const {
      currentTab
    } = this.state;

    let shouldShowPerformanceScreen = ((config.CAN_CAPTURE_STREAM && localInputStream) || (!config.CAN_CAPTURE_STREAM && localOutputStream));
    return (
      <div className="mobilelayout-component">
        <Tabs
          className="tabs"
          value={currentTab}
          onChange={(e, currentTab) => this.setState({ currentTab })}
          variant="scrollable"
        >
          
          <Tab className="tab" label={ 
            <Badge badgeContent={myCurrentPlace && myCurrentPlace.partyQueue.length} color="error">
              Party
            </Badge>} 
          />
          <Tab className="tab" label="Filters" />
          <Tab className="tab" label="Places" />
          <Tab className="tab" label="Local" />
          { currentParty && <Tab className="tab" label="Videos" /> }
          { currentParty && <Tab className="tab" label="Chat" /> }
          { currentParty && <Tab className="tab" label="Inventory" /> }
          { currentParty && <Tab className="tab" label="History" /> }
        </Tabs>
        <TabPanel value={currentTab} index={0} className="tab-panel">
          <PartyTab system={system} actions={actions} />
        </TabPanel>
        <TabPanel value={currentTab} index={1} className="tab-panel">
          <FilterTab system={system} actions={actions} />
        </TabPanel>
        <TabPanel value={currentTab} index={2} className="tab-panel">
          <PlaceTab system={system} actions={actions} />
        </TabPanel>
        <TabPanel value={currentTab} index={3} className="tab-panel">
          {shouldShowPerformanceScreen && <PerformanceScreen system={system} actions={actions} hasParty={false} isPreviewing={!!previewedParty} />}
        </TabPanel>
        {
          currentParty && 
          <TabPanel value={currentTab} index={4} className="tab-panel">
            {localOutputStream && <VideoRow system={system} actions={actions} /> }
          </TabPanel>
        }
        {
          currentParty && 
          <TabPanel value={currentTab} index={5} className="tab-panel">
            <ChatTab system={system} actions={actions} party={party} isVisible={currentTab === 5} />
          </TabPanel>
        }
        {
          currentParty && 
          <TabPanel value={currentTab} index={6} className="tab-panel">
            <InventoryTab system={system} actions={actions} party={party} />
          </TabPanel>
        }
        {
          currentParty && 
          <TabPanel value={currentTab} index={7} className="tab-panel">
            <HistoryTab system={system} actions={actions} party={party} />
          </TabPanel>
        }
      </div>
    );
  }
}

MobileLayout.displayName = 'MobileLayout';
MobileLayout.propTypes = {};
MobileLayout.defaultProps = {};

export default MobileLayout;
