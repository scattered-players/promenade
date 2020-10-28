import React from 'react';

import './localfeed.scss';

class LocalFeed extends React.Component {

  async componentDidMount() {
    const {
      actions: {
        setLocalStream
      },
      system: {
        localInputVideo
      },
      filter
    } = this.props;
    let { sourceCanvas } = this.props;
    this.dispose = await filter({
      canvas: sourceCanvas.current,
      localInputVideo
    });
  }

  componentWillUnmount() {
    if(this.dispose){
      this.dispose();
      this.dispose = null;
    }
  }

  render() {
    let {
      sourceCanvas
    } = this.props;
    return (
      <>
        <canvas className="filter-canvas" ref={sourceCanvas} width="1280" height="720"></canvas>
      </>
    );
  }
}

LocalFeed.displayName = 'LocalFeed';
LocalFeed.propTypes = {};
LocalFeed.defaultProps = {};

export default LocalFeed;
