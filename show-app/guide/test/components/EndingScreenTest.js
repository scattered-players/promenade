import React from 'react';
import { shallow } from 'enzyme';
import EndingScreen from 'components/EndingScreen.js';

describe('<EndingScreen />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<EndingScreen />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "endingscreen-component"', function () {
      expect(component.hasClass('endingscreen-component')).to.equal(true);
    });
  });
});
