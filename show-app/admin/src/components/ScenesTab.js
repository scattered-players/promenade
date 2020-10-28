import React from 'react';
import { format } from 'date-fns';
import orderBy from 'lodash/orderBy';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import ClearIcon from '@material-ui/icons/Clear';

import './scenestab.scss';

const noShow = {
  _id: null,
  date: null,
  parties: []
};

class ScenesTab extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedShow: noShow
    };

  }

  selectShow(showId) {
    const matchingShows = [noShow, ...this.props.system.shows].filter(show => show._id === showId);
    if (matchingShows.length) {
      this.setState({ selectedShow: matchingShows[0] })
    }
  }

  render() {
    const {
      system: {
        scenes,
        shows
      },
      actions: {
        deleteScene,
        deleteHistoryEntry
      }
    } = this.props;
    const {
      selectedShow
    } = this.state;
    const selectableShows = orderBy([noShow, ...shows], 'date');
    const rows = [];
    scenes.map(scene => {
      let matchingRows = rows.filter(row => row.place._id === scene.place._id);
      if(matchingRows.length) {
        matchingRows[0].scenes.push(scene);
      } else {
        rows.push({
          place: scene.place,
          scenes: [scene]
        });
      }
    });
    let selectedShowScenes = [];
    selectedShow.parties.map(party => {
      scenes.map(scene => {
        if(scene.party._id === party._id) {
          selectedShowScenes.push(scene);
        }
      })
    });
    selectedShowScenes = orderBy(selectedShowScenes, 'startTime');

    return (
      <div className="scenestab-component">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Character</TableCell>
                <TableCell align="right"># of scenes</TableCell>
                <TableCell align="right">Total Time (sec)</TableCell>
                <TableCell align="right">Avg. Scene Time (sec)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                let endedScenes = row.scenes.filter(scene => !!scene.endTime),
                  totalTime = endedScenes.reduce((acc, scene) => acc+(new Date(scene.endTime)-new Date(scene.startTime)), 0) / 1000,
                  avgTime = totalTime / endedScenes.length,
                  totalMinutes = Math.floor(totalTime / 60),
                  totalSeconds = Math.round(totalTime % 60),
                  avgMinutes = Math.floor(avgTime / 60),
                  avgSeconds = Math.round(avgTime % 60);


                return (
                  <TableRow key={row.place._id}>
                    <TableCell component="th" scope="row">
                      {row.place.characterName}
                    </TableCell>
                    <TableCell align="right">{ row.scenes.length }</TableCell>
                    <TableCell align="right">
                      { totalMinutes > 0 && `${totalMinutes} min ` }
                      { `${totalSeconds} sec` }
                    </TableCell>
                    <TableCell align="right">
                      { avgMinutes > 0 && `${avgMinutes} min ` }
                      { `${avgSeconds} sec` }
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="history-editor">
          <FormControl className="show-select-dropdown">
            <InputLabel id="show-select-input-label">Show</InputLabel>
            <Select
              labelId="show-select-input-label"
              value={selectedShow._id}
              onChange={e => this.selectShow(e.target.value)}
            >
              {
                selectableShows.map(show => (
                  <MenuItem key={show._id} value={show._id}>{ !!show.date ? format(new Date(show.date), 'M/d/yy h:mm a') : '---'}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          { !!selectedShowScenes.length && <Typography variant="h2">Scenes</Typography> }
          <List>
            {
              selectedShowScenes.map(scene => {
                let startDate = new Date(scene.startTime),
                  endDate = scene.endTime && new Date(scene.endTime),
                  duration = scene.endTime ? (endDate - startDate)/1000 : 0,
                  durationMinutes = Math.floor(duration / 60),
                  durationSeconds = Math.floor(duration % 60),
                  durationString = duration ? ((durationMinutes ? (durationMinutes + 'min ') : '') + durationSeconds + 'sec') : 'Ongoing';
                return (
                  <ListItem key={scene._id}>
                    <ListItemText
                      primary={ `${scene.party.name} - ${scene.place.placeName}`}
                      secondary={ `${format(startDate, 'M/d/yy h:mm:ss a')} - ${endDate ? format(endDate, 'M/d/yy h:mm:ss a') : 'Now'} (${durationString})`}
                    />
                    <IconButton onClick={() => deleteScene(scene._id)}>
                      <ClearIcon />
                    </IconButton>
                  </ListItem>
                );
              })
            }
          </List>
          { !!selectedShow.parties.length && <Typography variant="h2">History Entries</Typography> }
          {
            selectedShow.parties.map(party => (
              <div key={party._id}>
                <Typography variant="h3">{party.name}</Typography>
                <List>
                  {
                    party.history.map((place, index) => (
                      <ListItem key={place._id + index} >
                        <ListItemText primary={place.placeName} />
                        <IconButton onClick={() => deleteHistoryEntry(party._id, index)}>
                          <ClearIcon />
                        </IconButton>
                      </ListItem>
                    ))
                  }
                </List>
              </div>
            ))
          }

        </div>
      </div>
    );
  }
}

ScenesTab.displayName = 'ScenesTab';
ScenesTab.propTypes = {};
ScenesTab.defaultProps = {};

export default ScenesTab;
