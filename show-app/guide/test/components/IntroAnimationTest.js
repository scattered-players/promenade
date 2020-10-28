import React from 'react';
import { shallow } from 'enzyme';
import IntroAnimation from 'components/IntroAnimation.js';

describe('<IntroAnimation />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<IntroAnimation />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "introanimation-component"', function () {
      expect(component.hasClass('introanimation-component')).to.equal(true);
    });
  });
});
