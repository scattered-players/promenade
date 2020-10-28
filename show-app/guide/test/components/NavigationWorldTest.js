import React from 'react';
import { shallow } from 'enzyme';
import NavigationWorld from 'components/NavigationWorld.js';

describe('<NavigationWorld />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<NavigationWorld />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "navigationworld-component"', function () {
      expect(component.hasClass('navigationworld-component')).to.equal(true);
    });
  });
});
