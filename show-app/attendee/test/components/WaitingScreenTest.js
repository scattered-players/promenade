import React from 'react';
import { shallow } from 'enzyme';
import WaitingScreen from 'components/WaitingScreen.js';

describe('<WaitingScreen />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<WaitingScreen />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "waitingscreen-component"', function () {
      expect(component.hasClass('waitingscreen-component')).to.equal(true);
    });
  });
});
