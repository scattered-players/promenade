import React from 'react';
import { shallow } from 'enzyme';
import MobileLayout from 'components/MobileLayout.js';

describe('<MobileLayout />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<MobileLayout />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "mobilelayout-component"', function () {
      expect(component.hasClass('mobilelayout-component')).to.equal(true);
    });
  });
});
