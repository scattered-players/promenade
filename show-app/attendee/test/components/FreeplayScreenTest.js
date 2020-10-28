import React from 'react';
import { shallow } from 'enzyme';
import FreeplayScreen from 'components/FreeplayScreen.js';

describe('<FreeplayScreen />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<FreeplayScreen />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "freeplayscreen-component"', function () {
      expect(component.hasClass('freeplayscreen-component')).to.equal(true);
    });
  });
});
