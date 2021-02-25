import React from 'react';

import {
  AppBar,
  Tab,
  Tabs,
  Typography,
  Snackbar
} from '@material-ui/core';

import CloudDoneIcon from '@material-ui/icons/CloudDone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudOffIcon from '@material-ui/icons/CloudOff';

import socketStatusEnum from '../enum/socketStatus';

import ShowsTab from './ShowsTab';
import TodayTab from './TodayTab';
import StaffTab from './StaffTab';
import ErrorsTab from './ErrorsTab';
import SlowlinkTab from './SlowlinkTab';
import ScenesTab from './ScenesTab';
import PhasesTab from './PhasesTab';

import './main.scss';

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
      { (value === index) && children }
    </div>
  );
}

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 0
    };

    this.init = this.init.bind(this);
  }

  init() {
    const { actions, system, socketStatus } = this.props;
    const { login, contactShowService } = actions;
    const { user, isAuthenticating, triedAuthentication } = system;
    const { connectionStatus, triedConnecting } = socketStatus;
    if (!user && !isAuthenticating && !triedAuthentication){
      login();
    }

    if(user && !triedConnecting && connectionStatus === socketStatusEnum.NOT_CONNECTED) {
      contactShowService();
    }
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {
    this.init();
  }

  render() {
    const {
      actions,
      system,
      socketStatus,
      snackbar
    } = this.props;
    const {
      triedAuthentication,
      user,
      pullTime,
      showPullTime,
      adminSockets,
      actorSockets,
      attendeeSockets,
      guideSockets
    } = system;
    const {
      newAdminEmail,
      currentTab
    } = this.state;
    const connectionIconDict = {
      [socketStatusEnum.NOT_CONNECTED]: <CloudOffIcon />,
      [socketStatusEnum.CONNECTING]: <CloudUploadIcon />,
      [socketStatusEnum.CONNECTED]: <CloudDoneIcon />,
    };

    const mainApp = (
      <>
        <AppBar position="static">
          <div className="diagnostics-bar">
            {connectionIconDict[socketStatus.connectionStatus]}
            <span>{ `Total pull time: ${pullTime}s | Show pull time: ${showPullTime}s | Admin sockets: ${adminSockets} | Actor sockets: ${actorSockets} | Attendee sockets: ${attendeeSockets} | Guide sockets: ${guideSockets}`}</span>
          </div>
          <Tabs value={currentTab} onChange={(e, currentTab) => this.setState({currentTab})}>
            <Tab label="Today" />
            <Tab label="All Shows" />
            <Tab label="Staff" />
            <Tab label="Logs" />
            <Tab label="Connectivity" />
            <Tab label="Scenes" />
            <Tab label="Phases" />
          </Tabs>
        </AppBar>
        <TabPanel value={currentTab} index={0} className="tab-panel">
          <TodayTab system={system} actions={actions} />
        </TabPanel>
        <TabPanel value={currentTab} index={1} className="tab-panel">
          <ShowsTab system={system} actions={actions} />
        </TabPanel>
        <TabPanel value={currentTab} index={2} className="tab-panel">
          <StaffTab system={system} actions={actions} />
        </TabPanel>
        <TabPanel value={currentTab} index={3} className="tab-panel">
          <ErrorsTab system={system} actions={actions} />
        </TabPanel>
        <TabPanel value={currentTab} index={4} className="tab-panel">
          <SlowlinkTab system={system} actions={actions} />
        </TabPanel>
        <TabPanel value={currentTab} index={5} className="tab-panel">
          <ScenesTab system={system} actions={actions} />
        </TabPanel>
        <TabPanel value={currentTab} index={6} className="tab-panel">
          <PhasesTab system={system} actions={actions} />
        </TabPanel>
      </>
    )
  
    return (
      <div>
        { 
          !!user
          ? mainApp
          : (triedAuthentication
            ? <Typography variant="h1">Login failed</Typography>
            : <Typography variant="h1">Logging in...</Typography>
            )
        }
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={snackbar.open}
          autoHideDuration={snackbar.timeout}
          onClose={actions.dismissSnackbar}
          message={<span id="message-id">{snackbar.text}</span>}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
        />
      </div>
    );
  }
}

Main.displayName = 'Main';
Main.propTypes = {};
Main.defaultProps = {};

export default Main;
