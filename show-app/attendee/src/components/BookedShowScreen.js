import React from 'react';

import { format } from 'date-fns'

import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';

import HairCheck from './HairCheck';

import {
  SHOW_TITLE
} from 'custom/config.json';
import TheProgram from 'custom/screens/TheProgram';

import './bookedshowscreen.scss';

class BookedShowScreen extends React.Component {
  render() {
    const {
      bookedShows,
      system,
      actions
    } = this.props,
    {
      localStream
    } = system;
    return (
      <Container className="bookedshowscreen-component">
        <Typography variant="h1">{SHOW_TITLE}</Typography>
        <Typography variant="h2">Upcoming shows</Typography>
        <Typography variant="body1">Your show has not yet started, you are scheduled for the following shows:</Typography>
        <List>
          { bookedShows.map(show => (
            <ListItem key={show._id}>
              <ListItemText primary={format(new Date(show.date), 'M/d/yy h:mm a')} />
            </ListItem>
          ))}
        </List>
        <Typography variant="h2">Test your setup</Typography>
          <div className="hair-check">
            {
              localStream
              ? (
                <>
                  { <HairCheck system={system} actions={actions} /> }
                </>
              ) : (
                <>
                  <Typography variant="h3">Troubleshoot your Webcam/Microphone</Typography>
                  <Typography variant="body1">
                    It appears that we cannot access your camera and/or your microphone.
                    You can participate via text chat if you'd like, or you can follow these steps to troubleshoot your setup.
                    Bear in mind that even if you give us camera and/or microphone access, 
                    you can mute your microphone or turn off your camera at any time in the show.
                  </Typography>
                  <Typography variant="h4">Troubleshooting</Typography>
                  <ul>
                    <li>
                        If you're using a USB webcam or microphone, make sure it is plugged in and is not being used by any other applications.
                        (Unplugging it and plugging it back in may help)
                    </li>
                    <li>
                      If you didn't click "Allow" when asked for your camera and microphone, we can't access them.
                      If you're using Google Chrome, go to the camera settings page (chrome://settings/content/camera) and remove https://mirrors.show from your Block list.
                      Make sure to do the same on the microphone settings page (chrome://settings/content/microphone).
                      Then refresh this page and click "Allow".
                    </li>
                    <li>
                      <a href="https://test.webrtc.org/" target="_blank">This website</a> can check if your camera and microphone are working.
                      Click "Allow" if asked for permission to access them, then click the green "START" button to test your setup.
                    </li>
                  </ul>
                </>
              )
            }
          </div>
          <TheProgram />
      </Container>
    );
  }
}

BookedShowScreen.displayName = 'BookedShowScreen';
BookedShowScreen.propTypes = {};
BookedShowScreen.defaultProps = {};

export default BookedShowScreen;
