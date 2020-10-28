import React from 'react';
import { shallow } from 'enzyme';
import Settings from 'components/Settings.js';

describe('<Settings />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Settings />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "settings-component"', function () {
      expect(component.hasClass('settings-component')).to.equal(true);
    });
  });
});
