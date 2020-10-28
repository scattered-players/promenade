import React from 'react';
import { shallow } from 'enzyme';
import IntroScreen from 'components/IntroScreen.js';

describe('<IntroScreen />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<IntroScreen />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "introscreen-component"', function () {
      expect(component.hasClass('introscreen-component')).to.equal(true);
    });
  });
});
