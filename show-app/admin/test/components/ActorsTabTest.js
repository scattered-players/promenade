import React from 'react';
import { shallow } from 'enzyme';
import ActorsTab from 'components/ActorsTab.js';

describe('<ActorsTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<ActorsTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "actorstab-component"', function () {
      expect(component.hasClass('actorstab-component')).to.equal(true);
    });
  });
});
