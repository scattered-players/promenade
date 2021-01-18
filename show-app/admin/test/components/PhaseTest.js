import React from 'react';
import { shallow } from 'enzyme';
import Phase from 'components/Phase.js';

describe('<Phase />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Phase />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "phase-component"', function () {
      expect(component.hasClass('phase-component')).to.equal(true);
    });
  });
});
