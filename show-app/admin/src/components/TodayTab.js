import React from 'react';

import {
  Container,
  Button,
  Typography,
  FormControlLabel,
  Switch
} from '@material-ui/core';

import Show from './Show';

import './todaytab.scss';

const isToday = someDateString => {
  const someDate = new Date(someDateString);
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}



class TodayTab extends React.Component {

  render() {
    const { actions, system } = this.props;
    const {
      guides,
      phases,
      wantsNotifications
    } = system;
    const {
      refreshEventbrite,
      toggleNotifications
    } = actions;
    const todaysShows = system.shows.filter(show => isToday(show.date));
    return (
      <div className="todaytab-component">
        <Container>
          <div>
            <Button onClick={() => refreshEventbrite()}>Refresh Eventbrite data</Button>
            <FormControlLabel control={<Switch checked={!!wantsNotifications} onChange={ e => toggleNotifications(e.target.checked) } />} label="Notificationpalooza"/>
          </div>
          {
            todaysShows.length
            ? (
              todaysShows.map(show => <Show actions={actions} show={show} guides={guides} phases={phases} key={show._id}/>)
            ) : (
              <Typography variant="h3">No shows schduled for today</Typography>
            )
          }
        </Container>
      </div>
    );
  }
}

TodayTab.displayName = 'TodayTab';
TodayTab.propTypes = {};
TodayTab.defaultProps = {};

export default TodayTab;
