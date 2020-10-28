import React from 'react';
import { shallow } from 'enzyme';
import PerformanceScreen from 'components/PerformanceScreen.js';

describe('<PerformanceScreen />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<PerformanceScreen />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "performancescreen-component"', function () {
      expect(component.hasClass('performancescreen-component')).to.equal(true);
    });
  });
});
