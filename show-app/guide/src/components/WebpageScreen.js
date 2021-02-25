import React from 'react';

import './webpagescreen.scss';

class WebpageScreen extends React.Component {
  render() {
    const {
      system: {
        currentShow: {
          currentPhase
        }
      }
    } = this.props;
    return (
      <div className="webpagescreen-component">
        <iframe src={currentPhase.attributes.url}></iframe>
      </div>
    );
  }
}

WebpageScreen.displayName = 'WebpageScreen';
WebpageScreen.propTypes = {};
WebpageScreen.defaultProps = {};

export default WebpageScreen;
