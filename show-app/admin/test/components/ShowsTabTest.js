import React from 'react';
import { shallow } from 'enzyme';
import ShowsTab from 'components/ShowsTab.js';

describe('<ShowsTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<ShowsTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "showstab-component"', function () {
      expect(component.hasClass('showstab-component')).to.equal(true);
    });
  });
});
