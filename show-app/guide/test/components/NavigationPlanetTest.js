import React from 'react';
import { shallow } from 'enzyme';
import NavigationPlace from 'components/NavigationPlace.js';

describe('<NavigationPlace />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<NavigationPlace />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "navigationplace-component"', function () {
      expect(component.hasClass('navigationplace-component')).to.equal(true);
    });
  });
});
