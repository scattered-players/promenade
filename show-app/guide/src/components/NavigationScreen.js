import React from 'react';
import config from 'config';
import {
  NAV_ARRIVAL_SOUND,
  NAV_DEPARTURE_SOUND,
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
    }
  }

  componentDidUpdate(prevProps){
    const {
      system: {
        myParty,
        muteNavMusic
      }
    } = this.props;

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
  }

  render() {
    const {
      actions: {
        selectPlace,
        queueAtPlace,
        toggleNavMusic
      },
      system: {
        currentPlaces,
        muteNavMusic,
        currentShow,
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
    const availablePlaces = currentPlaces
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

    const isDecisionTime = hasSelectedValidPlace && !myParty.nextPlace;

    return (
      <div className="navigationscreen-component">
        { currentShow.currentPhase.attributes.backgroundMusicUrl && currentShow.currentPhase.attributes.backgroundMusicUrl.length && !config.IS_MOBILE && <audio src={currentShow.currentPhase.attributes.backgroundMusicUrl} crossOrigin="anonymous" autoPlay muted={muteNavMusic} loop /> }
        <div className="place-menu">
          <Typography className="place-menu-heading">CHOOSE A PLACE TO GO</Typography>
          <div className="go-button-wrapper">
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
          <MenuList className="place-list">
            { availablePlaces.map(({place, hasVisited, visitCount}) => (
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
                  <div className="visit-count">{ visitCount }</div>
                  { hasVisited && <DoneIcon fontSize="small"/> }
                </MenuItem>
              </Tooltip>
              )) }
          </MenuList>
          </div>
        { !config.IS_MOBILE && 
          <div className="navigation-wrapper">
          { config.CAN_PLAY_WEBM && currentShow.currentPhase.attributes.overlayVideoUrl && currentShow.currentPhase.attributes.overlayVideoUrl.length && <video src={currentShow.currentPhase.attributes.overlayVideoUrl} autoPlay muted playsInline loop/> }
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
