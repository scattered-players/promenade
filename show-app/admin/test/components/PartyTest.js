import React from 'react';
import { shallow } from 'enzyme';
import Party from 'components/Party.js';

describe('<Party />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Party />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "party-component"', function () {
      expect(component.hasClass('party-component')).to.equal(true);
    });
  });
});
