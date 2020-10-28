import React from 'react';
import { shallow } from 'enzyme';
import HairCheck from 'components/HairCheck.js';

describe('<HairCheck />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<HairCheck />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "haircheck-component"', function () {
      expect(component.hasClass('haircheck-component')).to.equal(true);
    });
  });
});
