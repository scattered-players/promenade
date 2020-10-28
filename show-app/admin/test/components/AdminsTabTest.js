import React from 'react';
import { shallow } from 'enzyme';
import AdminsTab from 'components/AdminsTab.js';

describe('<AdminsTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<AdminsTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "adminstab-component"', function () {
      expect(component.hasClass('adminstab-component')).to.equal(true);
    });
  });
});
