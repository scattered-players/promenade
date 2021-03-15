import React from 'react';
import { shallow } from 'enzyme';
import MegaphoneScreen from 'components/MegaphoneScreen.js';

describe('<MegaphoneScreen />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<MegaphoneScreen />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "megaphonescreen-component"', function () {
      expect(component.hasClass('megaphonescreen-component')).to.equal(true);
    });
  });
});
