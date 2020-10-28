import React from 'react';
import { shallow } from 'enzyme';
import ScenesTab from 'components/ScenesTab.js';

describe('<ScenesTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<ScenesTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "scenestab-component"', function () {
      expect(component.hasClass('scenestab-component')).to.equal(true);
    });
  });
});
