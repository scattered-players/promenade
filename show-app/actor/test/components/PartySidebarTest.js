import React from 'react';
import { shallow } from 'enzyme';
import PartySidebar from 'components/PartySidebar.js';

describe('<PartySidebar />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<PartySidebar />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "partysidebar-component"', function () {
      expect(component.hasClass('partysidebar-component')).to.equal(true);
    });
  });
});
