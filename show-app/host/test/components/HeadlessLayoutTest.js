import React from 'react';
import { shallow } from 'enzyme';
import HeadlessLayout from 'components/HeadlessLayout.js';

describe('<HeadlessLayout />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<HeadlessLayout />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "headlesslayout-component"', function () {
      expect(component.hasClass('headlesslayout-component')).to.equal(true);
    });
  });
});
