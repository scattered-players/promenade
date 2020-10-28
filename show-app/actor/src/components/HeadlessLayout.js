import React from 'react';

import PartyTab from './PartyTab';
import PlaceTab from './PlaceTab';
import ChatTab from './ChatTab';
import InventoryTab from './InventoryTab';
import HistoryTab from './HistoryTab';

import './headlesslayout.scss';

class HeadlessLayout extends React.Component {

  render() {
    const {
      system,
      actions,
      party
    } = this.props,
    {
      currentParty
    } = system;

    return (
      <div className="headlesslayout-component">
        <div className="headless-tab">
          <PartyTab system={system} actions={actions} />
        </div>
        <div className="headless-tab">
          <PlaceTab system={system} actions={actions} />
        </div>
        {
          !!party &&
            <>
              <div className="headless-tab">
                <ChatTab system={system} actions={actions} party={party} />
              </div>
              <div className="headless-tab">
                <InventoryTab system={system} actions={actions} party={party} />
              </div>
              <div className="headless-tab">
                <HistoryTab system={system} actions={actions} party={party} />
              </div>
            </>
        }
      </div>
    );
  }
}

HeadlessLayout.displayName = 'HeadlessLayout';
HeadlessLayout.propTypes = {};
HeadlessLayout.defaultProps = {};

export default HeadlessLayout;
