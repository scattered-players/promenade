import React from 'react';
import { shallow } from 'enzyme';
import TheProgram from 'components/TheProgram.js';

describe('<TheProgram />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<TheProgram />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "theprogram-component"', function () {
      expect(component.hasClass('theprogram-component')).to.equal(true);
    });
  });
});
