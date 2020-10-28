import React from 'react';

import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  IconButton,
} from '@material-ui/core';

import ClearIcon from '@material-ui/icons/Clear';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import RefreshIcon from '@material-ui/icons/Refresh';

import './guidestab.scss';

class GuidesTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newGuideEmail: '',
      newGuideUsername: '',
      newGuideCharacterName: '',
      isShowingCreateDialog: false
    };

    this.createGuide = this.createGuide.bind(this);
  }

  createGuide() {
    const { actions } = this.props;
    const { createGuide } = actions;
    const { 
      newGuideEmail,
      newGuideUsername,
      newGuideCharacterName,
     } = this.state;
    if(newGuideUsername !== '' && newGuideCharacterName !== '') {
      this.setState({
        newGuideEmail: '',
        newGuideUsername: '',
        newGuideCharacterName: ''
      }, () => {
        createGuide(newGuideEmail, newGuideUsername, newGuideCharacterName);
      });
    }
  }

  render() {
    const {
      actions,
      system
    } = this.props;
    const {
      getMagicLink,
      kickParty,
      deleteGuide
    } = actions;
    const { guides } = system;
    const {
      newGuideEmail,
      newGuideUsername,
      newGuideCharacterName,
      isShowingCreateDialog,
      forceRefreshUser
    } = this.state;
    return (
      <>
        <div>
          <Button onClick={ () => this.setState({isShowingCreateDialog: true}) }>Create Guide</Button>
          <Dialog open={isShowingCreateDialog} onClose={() => this.setState({isShowingCreateDialog: false})}>
            <DialogContent className="create-guide-dialog">
              <TextField label="Email" value={newGuideEmail} onChange={ e => this.setState({ newGuideEmail: e.target.value }) }/>
              <TextField label="Username" value={newGuideUsername} onChange={ e => this.setState({ newGuideUsername: e.target.value }) }/>
              <TextField label="Character Name" value={newGuideCharacterName} onChange={ e => this.setState({ newGuideCharacterName: e.target.value }) }/>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({isShowingCreateDialog: false}, this.createGuide)}>CREATE</Button>
              <Button onClick={() => this.setState({isShowingCreateDialog: false})}>CANCEL</Button>
            </DialogActions>
          </Dialog>
        </div>
        <div>
          <List dense={true}>
            {
              guides.map(guide => {
                const audioIndicator = guide.audioError
                  ? (
                    <Tooltip title={`AUDIO ERROR: ${guide.audioError}`}>
                      <span>
                        <Badge badgeContent="!" color="error" />
                        <MicOffIcon />
                      </span>
                    </Tooltip>
                  ) : (
                    guide.isAudioMuted ? <MicOffIcon /> : <MicIcon />
                  );
                const videoIndicator = guide.videoError
                  ? (
                    <Tooltip title={`VIDEO ERROR: ${guide.videoError}`}>
                      <span>
                        <Badge badgeContent="!" color="error"/>
                        <VideocamOffIcon />
                      </span>
                    </Tooltip>
                  ) : (
                    guide.isVideoMuted ? <VideocamOffIcon /> : <VideocamIcon />
                  );
                return (
                  <ListItem key={guide._id} className="guide-list-item">
                    <div className="guide-headline">
                      <div className={ 'guide-status-indicator ' + (guide.isOnline ? 'ready' : 'not-online')}></div>
                      <ListItemText 
                        primary={guide.username}
                        secondary={guide.characterName}
                        className="guide-list-item-text"
                      />
                      <div className="attendee-icons">
                        <div className="attendee-icon-wrapper">
                          { audioIndicator }
                        </div>
                        <div className="attendee-icon-wrapper">
                          { videoIndicator }
                        </div>
                        <div className="attendee-icon-wrapper">
                          <IconButton onClick={() => forceRefreshUser(guide._id)}>
                            <RefreshIcon />
                          </IconButton>
                        </div>
                      </div>
                      <Button onClick={()=> getMagicLink(guide._id)}>Get Link</Button>
                      <Typography variant="body1">{guide.currentBrowser}</Typography>
                      <IconButton onClick={() => deleteGuide(guide._id)}>
                        <ClearIcon />
                      </IconButton>
                    </div>
                  </ListItem>
                  )
              })
            }
          </List>
        </div>
      </>
    );
  }
}

GuidesTab.displayName = 'GuidesTab';
GuidesTab.propTypes = {};
GuidesTab.defaultProps = {};

export default GuidesTab;
