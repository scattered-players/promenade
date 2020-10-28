import React from 'react';
import debounce from 'lodash/debounce';

import {
  TextField
} from '@material-ui/core';

import './notestab.scss';

class NotesTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      oldNotes: '',
      currentNotes: ''
    };

    this.saveNotes = debounce(this.saveNotes.bind(this), 1000);
  }

  static getDerivedStateFromProps(props, state) {
    const {
      party: {
        notes
      }
    } = props;

    if(notes !== state.oldNotes){
      return {
        oldNotes: notes,
        currentNotes: notes
      };
    }
  }

  saveNotes(){
    const {
      actions: {
        writeNotes
      },
      party: {
        _id: partyId
      }
    } = this.props;
    const {
      currentNotes
    } = this.state;

    writeNotes(partyId, currentNotes);
  }

  render() {
    const {
      currentNotes
    } = this.state;
    return (
      <div className="notestab-component">
        <TextField
          label="Notes"
          multiline
          variant="outlined"
          value={currentNotes}
          fullWidth
          onChange={e => this.setState({ currentNotes: e.target.value}, this.saveNotes)}
        />
      </div>
    );
  }
}

NotesTab.displayName = 'NotesTab';
NotesTab.propTypes = {};
NotesTab.defaultProps = {};

export default NotesTab;
