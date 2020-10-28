import React from 'react';
import { shallow } from 'enzyme';
import BlockedScreen from 'components/BlockedScreen.js';

describe('<BlockedScreen />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<BlockedScreen />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "blockedscreen-component"', function () {
      expect(component.hasClass('blockedscreen-component')).to.equal(true);
    });
  });
});
