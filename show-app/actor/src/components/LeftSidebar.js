import React from 'react';
import config from 'config';

import {
  Badge,
  Tab,
  Tabs,
} from '@material-ui/core';


import FilterTab from './FilterTab';
import PartyTab from './PartyTab';
import PlaceTab from './PlaceTab';

import './leftsidebar.scss';

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

class LeftSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 0
    };
  }

  render() {
    const { actions, system } = this.props,
    {
      myPlace
    } = system,
    {
      currentTab
    } = this.state;
    return (
      <div className="leftsidebar-component">
        <Tabs
          className="tabs"
          value={currentTab}
          onChange={(e, currentTab) => this.setState({ currentTab })}
          variant="fullWidth"
        >
          <Tab className="tab" label={ 
            <Badge badgeContent={myPlace && myPlace.partyQueue.length} color="error">
              Party
            </Badge>}
          />
          <Tab className="tab" label="Filters" />
          <Tab className="tab" label="Places" />
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
      </div>
    );
  }
}

LeftSidebar.displayName = 'LeftSidebar';
LeftSidebar.propTypes = {};
LeftSidebar.defaultProps = {};

export default LeftSidebar;
