import React from 'react';
import { shallow } from 'enzyme';
import StaffTab from 'components/StaffTab.js';

describe('<StaffTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<StaffTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "stafftab-component"', function () {
      expect(component.hasClass('stafftab-component')).to.equal(true);
    });
  });
});
