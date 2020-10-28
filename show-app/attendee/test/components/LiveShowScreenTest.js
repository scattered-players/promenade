import React from 'react';
import { shallow } from 'enzyme';
import LiveShowScreen from 'components/LiveShowScreen.js';

describe('<LiveShowScreen />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<LiveShowScreen />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "liveshowscreen-component"', function () {
      expect(component.hasClass('liveshowscreen-component')).to.equal(true);
    });
  });
});
