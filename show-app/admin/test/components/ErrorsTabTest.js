import React from 'react';
import { shallow } from 'enzyme';
import ErrorsTab from 'components/ErrorsTab.js';

describe('<ErrorsTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<ErrorsTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "errorstab-component"', function () {
      expect(component.hasClass('errorstab-component')).to.equal(true);
    });
  });
});
