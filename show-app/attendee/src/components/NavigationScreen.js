import React from 'react';
import config from 'config';
import {
  NAV_OVERLAY_VIDEO,
  NAV_ARRIVAL_SOUND,
  NAV_DEPARTURE_SOUND,
  NAV_BACKGROUND_MUSIC,
  TRANSIT_TEXT
} from 'custom/config.json';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuList,
  MenuItem,
  Tooltip,
  Typography,
  Button
} from '@material-ui/core';

import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DoneIcon from '@material-ui/icons/Done';

import playAudio from '../util/audio';

import './navigationscreen.scss';

function comparePlaces(placeA, placeB) {
  if(placeA.hasVisited && !placeB.hasVisited){
    return 1;
  } else if(!placeA.hasVisited && placeB.hasVisited){
    return -1;
  } else if(placeA.visitCount > placeB.visitCount){
    return 1;
  } else if(placeA.visitCount < placeB.visitCount){
    return -1;
  } else {
    return 0;
  }
}

class NavigationScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      timeLeft: 0,
      showDeciderPopup: true
    };
  }

  componentDidMount() {
    const {
      system: {
        myParty
      },
      navWorker
    } = this.props;
    if(!config.IS_MOBILE){
      navWorker.newCanvas(this.refs.canvas);
      if(!!myParty.decider) {
        this.setState({showDeciderPopup: true});
        this.deciderPopupTimeout = setTimeout(() => {
          this.setState({showDeciderPopup: false});
        }, 10 * 1000);
      }
    }
    this.countdownInterval = setInterval(() => {
      const {
        system:{
          myParty: {
            decisionDeadline
          }
        }
      } = this.props;
      this.setState({ timeLeft: Math.max(0,Math.round((new Date(decisionDeadline) - Date.now())/1000)) });
    }, 500);
  }

  componentDidUpdate(prevProps){
    const {
      system: {
        myParty,
        muteNavMusic
      }
    } = this.props;
    const {
      showDeciderPopup
    } = this.state;
    if (showDeciderPopup && !myParty.decider) {
      clearTimeout(this.deciderPopupTimeout);
      this.setState({ showDeciderPopup: false });
    }

    if(!prevProps.system.myParty.nextPlace && !!myParty.nextPlace && !muteNavMusic){
      playAudio(NAV_DEPARTURE_SOUND);
    } else if(!!prevProps.system.myParty.nextPlace && !myParty.nextPlace && !muteNavMusic){
      playAudio(NAV_ARRIVAL_SOUND);
    } 
  }

  componentWillUnmount(){
    if(this.props.navWorker){
      this.props.navWorker.removeCanvas();
    }
    if (this.deciderPopupTimeout) {
      clearTimeout(this.deciderPopupTimeout);
    }
    if(this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  render() {
    const {
      actions: {
        selectPlace,
        queueAtPlace,
        toggleNavMusic
      },
      system: {
        currentShow,
        places,
        muteNavMusic,
        myParty,
        user
      }
    } = this.props;
    const {
      selectedPlace
    } = myParty;
    const {
      timeLeft,
      showDeciderPopup
    } = this.state;
    const placeDict = {};
    const availablePlaces = places
      .filter(place => (myParty.nextPlace && myParty.nextPlace._id === place._id) || (!place.currentParty && !place.partyQueue.length && place.isAvailable))
      .map(place => {
        let entry = {
          place,
          hasVisited: myParty.history.reduce((acc,visitedPlace) => acc || visitedPlace._id === place._id, false),
          visitCount: 0
        };
        placeDict[place._id] = entry;
        return entry;
      });

    currentShow.parties.map(party => party.history.map(place => {
      let entry = placeDict[place._id];
      if(entry) {
        entry.visitCount++;
      }
    }));
    availablePlaces.sort(comparePlaces);
    const hasSelectedValidPlace = selectedPlace && availablePlaces.reduce((acc, { place }) => acc || place._id === selectedPlace._id, false);

    const hasDecider = !!myParty.decider;
    const deciderIsYou = hasDecider && user._id === myParty.decider.attendee._id;
    const deciderPopup = showDeciderPopup && hasDecider && (
      deciderIsYou
      ? <div className="decider-popup"><span><strong>YOU</strong> DECIDE WHERE TO GO NEXT!</span></div>
      : <div className="decider-popup"><span><strong>{myParty.decider.attendee.username}</strong> DECIDES WHERE TO GO NEXT!</span></div>
    );

    const isDecisionTime = hasSelectedValidPlace && !myParty.nextPlace && (myParty.decider && user._id === myParty.decider.attendee._id);

    return (
      <div className="navigationscreen-component">
        { NAV_BACKGROUND_MUSIC && !config.IS_MOBILE && <audio src={NAV_BACKGROUND_MUSIC} crossOrigin="anonymous" autoPlay muted={muteNavMusic} loop /> }
        <div className="place-menu">
          <Typography className="place-menu-heading">Choose Your Destination!</Typography>
          {!!timeLeft && <Typography>Time left to choose: {timeLeft}</Typography>}
          {
            (!myParty.guide || !myParty.guide.isOnline) && <div className="go-button-wrapper">
              <Button
                className="go-button"
                disabled={!isDecisionTime}
                onClick={() => queueAtPlace(myParty._id, selectedPlace._id)}
              >
                GO!
              </Button>
              {
                isDecisionTime && (
                  <div className="go-button-pointer">
                    <ArrowBackIcon fontSize="large"/>
                  </div>
                )
              }
            </div>
          }
          <MenuList className="place-list">
            { availablePlaces.map(({place, hasVisited}) => (
              <Tooltip key={place._id} title={place.flavorText} placement="right">
                <MenuItem
                  className={ `nav-item asset-${place.assetKey}`}
                  disabled={!!myParty.nextPlace}
                  selected={selectedPlace && selectedPlace._id === place._id}
                  onClick={() => selectPlace(myParty._id, place._id)}
                >
                  <ListItemText 
                    primary={place.placeName}
                    secondary={place.characterName}
                  />
                  <Typography variant="body1">{  }</Typography>
                  { hasVisited && <DoneIcon fontSize="small"/> }
                </MenuItem>
              </Tooltip>
              )) }
          </MenuList>
          </div>
        { !config.IS_MOBILE && 
          <div className="navigation-wrapper">
            { config.CAN_PLAY_WEBM && NAV_OVERLAY_VIDEO && <video src={NAV_OVERLAY_VIDEO} autoPlay muted playsInline loop/> }
            <canvas className="navigation-canvas" ref="canvas"></canvas>
            { deciderPopup }
            { !!myParty.nextPlace && <div className="transit-marker">{TRANSIT_TEXT}</div>}
            <IconButton className="nav-mute-toggle" onClick={() => toggleNavMusic(!muteNavMusic)}>
              { muteNavMusic ? <VolumeMuteIcon /> : <VolumeUpIcon /> }
            </IconButton>
          </div> 
        }
        { config.IS_MOBILE && !!myParty.nextPlace && <div className="transit-marker">{TRANSIT_TEXT}</div>}
      </div>
    );
  }
}

NavigationScreen.displayName = 'NavigationScreen';
NavigationScreen.propTypes = {};
NavigationScreen.defaultProps = {};

export default NavigationScreen;
