import React from 'react';
import { format } from 'date-fns';
import { 
  DragDropContext,
} from 'react-beautiful-dnd';

import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  Select,
  Switch,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  CUE_LIST
} from 'custom/config.json';

import Party from './Party';

import showStatusEnum from '../enum/showStatus';

import './show.scss';

class Show extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isExpanded: false,
      newAttendeeEmail:'',
      audioPath: '',
      showDeleteDialog: false,
      currentCue: 'None'
    };

    this.bookTicket = this.bookTicket.bind(this);
    this.sendAudioCue = this.sendAudioCue.bind(this);
    this.sendCue = this.sendCue.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  bookTicket() {
    const {
      actions,
      show
    } = this.props;
    const { bookTicket } = actions;
    const { _id: showId } = show;
    const { newAttendeeEmail } = this.state;
    if (newAttendeeEmail !== '') {
      this.setState({ newAttendeeEmail: '' }, () => {
        bookTicket(showId, newAttendeeEmail);
      });
    }
  }

  sendAudioCue() {
    const {
      actions
    } = this.props;
    const { sendAudioCue } = actions;
    const { audioPath } = this.state;
    if (audioPath !== '') {
      // this.setState({ audioPath: '' }, () => {
        sendAudioCue(audioPath);
      // });
    }
  }

  sendCue() {
    const {
      actions
    } = this.props;
    const { sendCue } = actions;
    const { currentCue } = this.state;
    if (currentCue !== 'None') {
      this.setState({ currentCue: 'None' }, () => {
        let matchingCues = CUE_LIST.filter(cue => cue.id === currentCue);
        if(matchingCues.length){
          sendCue(matchingCues[0]);
        }
      });
    }
  }

  onDragEnd(result) {
    const {
      actions: {
        moveAttendee
      },
      show
    } = this.props;
    if(!result.destination || result.destination.droppableId === result.source.droppableId) {
      return;
    }
    console.log('DROP', result)
    moveAttendee(result.draggableId, result.source.droppableId, result.destination.droppableId);
  }

  render() {
    const { actions, show, guides } = this.props;
    const {
      changeShowStatus,
      changeShowRunning,
      updateShowInfo,
      deleteShow,
      fetchShowEmailCsv,
      getStreamKey
    } = actions;
    const {
      isExpanded,
      newAttendeeEmail,
      showDeleteDialog,
      currentCue
    } = this.state;
    const cueList = [{
      id:'None'
    }, ...CUE_LIST].map(cue => cue.id);
    const dateString = format(new Date(show.date), 'M/d/yy h:mm a');
    let availableGuides = guides.filter(guide => !show.parties.reduce((acc, party) => acc || (party.guide && party.guide._id === guide._id), false));
    console.log('AVAILABLE GUIDES', availableGuides);
    return (
      <Accordion expanded={isExpanded} onChange={(e, isExpanded) => this.setState({isExpanded})}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className="show-heading">
            <div className={ 'running-indicator ' + (show.isRunning ? 'running' : 'not-running')}></div>
            <Typography>{dateString}</Typography>
            <div className="show-state">{show.state.replace('_', ' ')}</div>
          </div>
        </AccordionSummary>
        <AccordionDetails className="show-details">
          {isExpanded && <>
            <div className="show-status-area">
              {
                show.isRunning 
                  ? <Button onClick={ () => changeShowRunning(show._id, false)}>Stop Show</Button>
                  : <Button onClick={ () => changeShowRunning(show._id, true)}>Start Show</Button>
              }
              <FormControl >
                <InputLabel id={`${show._id}-state-select`}>Status</InputLabel>
                <Select
                  labelId={`${show._id}-state-select`}
                  value={show.state}
                  onChange={e => changeShowStatus(show._id, e.target.value)}
                >
                  {Object.keys(showStatusEnum).map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControlLabel control={<Switch checked={!!show.isEventbrite} onChange={ e => updateShowInfo(show._id, show.date, e.target.checked) } />} label="Is Eventbrite Show"/>
              { !show.isEventbrite && <Button style={{backgroundColor: 'red'}} onClick={() => this.setState({showDeleteDialog: true})}>DELETE SHOW</Button> }
              <div>
                {/* <Button onClick={ () => sendShowEmail(show._id)}>Send Login Emails</Button> */}
                <Button onClick={ () => fetchShowEmailCsv(show._id, show.date)}>Fetch Email CSV</Button>
                <Button onClick={ () => getStreamKey(show._id)}>Get Stream Key</Button>
                <Button href={`${location.protocol}//${location.host}/streamtest/?streamId=${show._id}`} target="_blank">Test Stream</Button>
              </div>
              {/* <div>
                <FormControlLabel control={<Switch checked={!!show.hasIntroAlert} onChange={ e => sendIntroAlert(show._id, e.target.checked) } />} label="Intro Alert"/>
                <FormControlLabel control={<Switch checked={!!show.hasEndingAlert} onChange={ e => sendEndingAlert(show._id, e.target.checked) } />} label="Ending Alert"/>
                <Button onClick={ () => cencelAlerts(show._id)}>Cancel Alerts</Button>
              </div> */}
            </div>
            <div>
              <TextField
                label="New Attendee Email"
                value={newAttendeeEmail}
                onChange={ e => this.setState({ newAttendeeEmail: e.target.value }) }
                onKeyPress={e => (e.key === 'Enter') && this.bookTicket()}
              />
              <Button onClick={ this.bookTicket }>Book Ticket</Button>
            </div>
            {/* <div>
              <TextField
                label="Audio Cue Path"
                value={audioPath}
                onChange={ e => this.setState({ audioPath: e.target.value }) }
                onKeyPress={e => (e.key === 'Enter') && this.sendAudioCue()}
              />
              <Button onClick={ this.sendAudioCue }>Send Audio Cue</Button>
            </div> */}
            <div>
              <FormControl >
                <InputLabel id={`${show._id}-cue-select`}>Cue</InputLabel>
                <Select
                  labelId={`${show._id}-cue-select`}
                  value={currentCue}
                  onChange={e => this.setState({ currentCue: e.target.value})}
                >
                  {cueList.map(cue => <MenuItem key={cue} value={cue}>{cue}</MenuItem>)}
                </Select>
              </FormControl>
              <Button onClick={ this.sendCue }>Send Cue</Button>
            </div>
            <Typography variant="h4">Parties</Typography>
            <DragDropContext onDragEnd={this.onDragEnd}>
              {
                show.parties.map(party => (<Party key={party._id} party={party} availableGuides={availableGuides} actions={actions}/>))
              }
            </DragDropContext>
            <Dialog open={showDeleteDialog} onClose={() => this.setState({showDeleteDialog: false})}>
              <DialogContent>
                <Typography variant="body1" color="error">
                  WARNING: ARE YOU SURE YOU WANT TO DELETE THE {dateString} SHOW?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => this.setState({showDeleteDialog: false}, () => deleteShow(show._id))} style={{backgroundColor: 'red'}}>YES, CAST IT INTO THE VOID</Button>
                <Button onClick={() => this.setState({showDeleteDialog: false})}>NO</Button>
              </DialogActions>
            </Dialog>
          </>}
        </AccordionDetails>
      </Accordion>
    );
  }
}

Show.displayName = 'Show';
Show.propTypes = {};
Show.defaultProps = {};
export default Show
