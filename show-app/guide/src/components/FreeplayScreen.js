import React from 'react';
import config from 'config';

import NavigationScreen from './NavigationScreen';
import InteractionScreen from './InteractionScreen';

import './freeplayscreen.scss';

class FreeplayScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage:''
    };
  }

  render() {
    const {
      actions,
      system,
      navWorker
    } = this.props;
    const {
      myParty
    } = system;
    return !config.IS_MOBILE && (
      myParty.currentPlace 
        ? <InteractionScreen actions={actions} system={system} />
        : <NavigationScreen actions={actions} system={system} navWorker={navWorker} />
    );
  }
}

FreeplayScreen.displayName = 'FreeplayScreen';
FreeplayScreen.propTypes = {};
FreeplayScreen.defaultProps = {};

export default FreeplayScreen;
