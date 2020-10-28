import React from 'react';
import { shallow } from 'enzyme';
import LeftSidebar from 'components/LeftSidebar.js';

describe('<LeftSidebar />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<LeftSidebar />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "leftsidebar-component"', function () {
      expect(component.hasClass('leftsidebar-component')).to.equal(true);
    });
  });
});
