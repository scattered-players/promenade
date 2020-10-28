import React from 'react';
import { shallow } from 'enzyme';
import Show from 'components/Show.js';

describe('<Show />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Show />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "show-component"', function () {
      expect(component.hasClass('show-component')).to.equal(true);
    });
  });
});
