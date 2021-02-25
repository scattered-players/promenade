import React from 'react';
import { shallow } from 'enzyme';
import Actor from 'components/Actor.js';

describe('<Actor />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Actor />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "actor-component"', function () {
      expect(component.hasClass('actor-component')).to.equal(true);
    });
  });
});
