import React from 'react';

import {
  Container,
  Typography
} from '@material-ui/core';

import TheProgram from 'custom/screens/TheProgram';

import './preshowscreen.scss';

class PreshowScreen extends React.Component {

  render() {
    const {
      actions,
      system
    } = this.props,
    {
      localStream,
      myParty
    } = system;
    return (
      <div className="preshowscreen-component">
        <Container>
          <h1 className="preshow-title">Welcome</h1>
          <div className="instructions">
            <Typography variant="h3">Settle in! The show will start shortly!</Typography>
            <p>The show will be starting shortly with an intro video. For the optimal viewing experience we recommend the following: </p>
            <ul>
              <li>Make sure your speakers are not muted.</li>
              <li>Make sure your computer is plugged in and not running on battery.</li>
              <li>If you can plug your computer into an Ethernet connection, we recommend it.</li>
              <li>Use Google Chrome if possible (unless you're on an iOS device, in which case you <u>must</u> use Safari).</li>
              <li> Turn on your camera and microphone on if you would like to interact directly with the performers.  </li>
              <li>Some scenes have a strobing effect that may affect photosensitive viewers. If you have light/motion sensitivity, you can turn these cues off by clicking the gear icon under your video and turning off "Show Visual Cues".</li>
            </ul>
          </div>
          <div className="hair-check">
            {
              localStream
              ? (
                <>
                  <Typography variant="h3">Say hello to adventurers in your fellowship! Hello! </Typography>
                  {myParty && <Typography variant="h3">Your fellowship will be guided by: {myParty.guide.characterName}</Typography>}
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
                      If you're using Google Chrome, go to the camera settings page (chrome://settings/content/camera) and remove https://mirrors.live from your Block list.
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
      </div>
    );
  }
}

PreshowScreen.displayName = 'PreshowScreen';
PreshowScreen.propTypes = {};
PreshowScreen.defaultProps = {};

export default PreshowScreen;
