import React from 'react';
import { shallow } from 'enzyme';
import SlowlinkTab from 'components/SlowlinkTab.js';

describe('<SlowlinkTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<SlowlinkTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "slowlinktab-component"', function () {
      expect(component.hasClass('slowlinktab-component')).to.equal(true);
    });
  });
});
