import React from 'react';

import StreamingEnding from './StreamingEnding';
import PreRecordedEnding from './PreRecordedEnding';
import endingTypeEnum from '../enum/endingType';

import './endingscreen.scss';

class EndingScreen extends React.Component {
  render() {
    let { system } = this.props;
    const screenDict = {
      [endingTypeEnum.STREAMING]: StreamingEnding,
      [endingTypeEnum.CHOICE]: PreRecordedEnding
    };
    const Ending = screenDict[system.currentShow.endingType];
    return (
      <div className="endingscreen-component">
        <Ending system={system} />
      </div>
    );
  }
}

EndingScreen.displayName = 'EndingScreen';
EndingScreen.propTypes = {};
EndingScreen.defaultProps = {};

export default EndingScreen;
