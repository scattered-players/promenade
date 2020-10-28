import React from 'react';
import { shallow } from 'enzyme';
import PreshowScreen from 'components/PreshowScreen.js';

describe('<PreshowScreen />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<PreshowScreen />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "preshowscreen-component"', function () {
      expect(component.hasClass('preshowscreen-component')).to.equal(true);
    });
  });
});
