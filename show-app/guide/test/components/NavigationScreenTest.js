import React from 'react';
import { shallow } from 'enzyme';
import NavigationScreen from 'components/NavigationScreen.js';

describe('<NavigationScreen />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<NavigationScreen />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "navigationscreen-component"', function () {
      expect(component.hasClass('navigationscreen-component')).to.equal(true);
    });
  });
});
