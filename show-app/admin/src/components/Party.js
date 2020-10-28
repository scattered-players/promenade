import React from 'react';

import { 
  Droppable,
  Draggable
} from 'react-beautiful-dnd';

import {
  Badge,
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Tooltip,
  Typography,
  Select,
  IconButton
} from '@material-ui/core';

import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import BlockIcon from '@material-ui/icons/Block';
import RefreshIcon from '@material-ui/icons/Refresh';

import './party.scss';

class Party extends React.Component {

  render() {
    const {
      party,
      availableGuides,
      actions: {
        setPartyGuide,
        getMagicLink,
        forceRefreshUser
      }
    } = this.props;
    let selectableGuides = [
      {_id: '', username: 'No Guide'},
      ...availableGuides
    ];
    let audioIndicator, videoIndicator;
    if(party.guide){
      selectableGuides.push(party.guide);
      audioIndicator = party.guide.audioError
        ? (
          <Tooltip title={`AUDIO ERROR: ${party.guide.audioError}`}>
            <span>
              <Badge badgeContent="!" color="error" />
              <MicOffIcon />
            </span>
          </Tooltip>
        ) : (
          party.guide.isAudioMuted ? <MicOffIcon /> : <MicIcon />
        );
      videoIndicator = party.guide.videoError
        ? (
          <Tooltip title={`VIDEO ERROR: ${party.guide.videoError}`}>
            <span>
              <Badge badgeContent="!" color="error"/>
              <VideocamOffIcon />
            </span>
          </Tooltip>
        ) : (
          party.guide.isVideoMuted ? <VideocamOffIcon /> : <VideocamIcon />
        );
    }
    return (
      <div>
        <Typography variant="h5">{party.name}</Typography>
        <div className="guide-headline">
          <div className={ 'guide-status-indicator ' + (party.guide ? (party.guide.isOnline ? 'ready' : 'not-online') : 'no-guide')}></div>
          <FormControl >
            <InputLabel id={`${party._id}-guide-select`}>Guide</InputLabel>
            <Select
              autoWidth
              displayEmpty
              labelId={`${party._id}-guide-select`}
              value={party.guide ? party.guide._id : ''}
              onChange={e => setPartyGuide(party._id, e.target.value ? e.target.value : null)}
            >
              {selectableGuides.map(guide => <MenuItem key={guide._id} value={guide._id}>{guide.username}</MenuItem>)}
            </Select>
          </FormControl>
          {party.guide && (
            <>
              <div className="attendee-icons">
                <div className="attendee-icon-wrapper">
                  { audioIndicator }
                </div>
                <div className="attendee-icon-wrapper">
                  { videoIndicator }
                </div>
                <div className="attendee-icon-wrapper">
                  <IconButton onClick={() => forceRefreshUser(party.guide._id)}>
                    <RefreshIcon />
                  </IconButton>
                </div>
              </div>
              <Button onClick={()=> getMagicLink(party.guide._id)}>Get Link</Button>
              <Typography variant="body1">{party.guide.currentBrowser}</Typography>
            </>
          )}
        </div>
        <Typography variant="h6">Attendees</Typography>
        <Droppable droppableId={party._id}>
          {(provided, snapshot) => (
            <List dense={true} ref={provided.innerRef} {...provided.droppableProps}>
              {party.attendances.map(({ _id: attendanceId, attendee }, i) => {
                const audioIndicator = attendee.audioError
                  ? (
                    <Tooltip title={`AUDIO ERROR: ${attendee.audioError}`}>
                      <span>
                        <Badge badgeContent="!" color="error" />
                        <MicOffIcon />
                      </span>
                    </Tooltip>
                  ) : (
                    attendee.isAudioMuted ? <MicOffIcon /> : <MicIcon />
                  );
                  const videoIndicator = attendee.videoError
                    ? (
                      <Tooltip title={`VIDEO ERROR: ${attendee.videoError}`}>
                        <span>
                          <Badge badgeContent="!" color="error"/>
                          <VideocamOffIcon />
                        </span>
                      </Tooltip>
                    ) : (
                      attendee.isVideoMuted ? <VideocamOffIcon /> : <VideocamIcon />
                    );
                return (
                  <Draggable key={attendanceId} draggableId={attendanceId} index={i}>
                    {(provided, snapshot) => (
                      <ListItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div className={ 'running-indicator ' + (attendee.isOnline ? 'running' : 'not-running')}></div>
                        <ListItemText 
                          primary={attendee.username}
                          secondary={attendee.email}
                          className="attendee-list-item-text"
                        />
                        <div className="attendee-icons">
                          <div className="attendee-icon-wrapper">
                            { audioIndicator }
                          </div>
                          <div className="attendee-icon-wrapper">
                            { videoIndicator }
                          </div>
                          <div className="attendee-icon-wrapper">
                            {
                              attendee.isBlocked
                              ? <BlockIcon />
                              : (
                                <IconButton onClick={() => forceRefreshUser(attendee._id)}>
                                  <RefreshIcon />
                                </IconButton>
                              )
                            }
                          </div>
                        </div>
                        <Button onClick={()=> getMagicLink(attendee._id)}>Get Link</Button>
                        <Typography variant="body1">{attendee.currentBrowser}</Typography>
                      </ListItem>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </div>
    );
  }
}

Party.displayName = 'Party';
Party.propTypes = {};
Party.defaultProps = {};

export default Party;
