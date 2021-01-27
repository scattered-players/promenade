import React from 'react';
import range from 'lodash/range';
import sortBy from 'lodash/sortBy';

import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
  IconButton,
  Select,
  Snackbar
} from '@material-ui/core';
import {
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import Show from './Show';

import './showstab.scss';

class ShowsTab extends React.Component {
  constructor(props) {
    super(props);

    // Get the current time rounded up to the next hour
    let newShowDate = new Date();
    newShowDate.setHours(newShowDate.getHours() + Math.ceil(newShowDate.getMinutes()/60));
    newShowDate.setMinutes(0);

    this.state = {
      newShowDate,
      newShowParties: 1
    };
  }

  render() {
    const { actions, system } = this.props;
    const { scheduleShow, refreshEventbrite } = actions;
    const { guides, phases } = system;
    const shows = sortBy(system.shows, show => show.date);
    const { newShowDate, newShowParties } = this.state;
    return (
      <Container>
        <div>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="new-show-date-picker"
            label="New Show Date"
            value={newShowDate}
            onChange={date => this.setState({ newShowDate: date})}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardTimePicker
            margin="normal"
            id="new-show-time-picker"
            label="New Show Time"
            value={newShowDate}
            onChange={date => this.setState({ newShowDate: date})}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
          />
          <FormControl >
            <InputLabel id="show-party-number"># of parties</InputLabel>
            <Select
              labelId="show-party-number"
              value={newShowParties}
              onChange={e => this.setState({ newShowParties: e.target.value})}
            >
              {range(1,7).map(numParties => <MenuItem key={numParties} value={numParties}>{numParties}</MenuItem>)}
            </Select>
          </FormControl>
          <Button onClick={() => scheduleShow(newShowDate, newShowParties)}>Schedule Show</Button>
        </div>
        <div>
          <Button onClick={() => refreshEventbrite()}>Refresh Eventbrite data</Button>
        </div>
        <div>
          <Typography variant="h3">Shows</Typography>
          { shows.map(show => <Show actions={actions} guides={guides} show={show} phases={phases} key={show._id}/>) }
        </div>
      </Container>
    );
  }
}

ShowsTab.displayName = 'ShowsTab';
ShowsTab.propTypes = {};
ShowsTab.defaultProps = {};

export default ShowsTab;
