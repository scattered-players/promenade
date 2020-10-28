import React from 'react';
import { shallow } from 'enzyme';
import FilterTab from 'components/FilterTab.js';

describe('<FilterTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<FilterTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "filtertab-component"', function () {
      expect(component.hasClass('filtertab-component')).to.equal(true);
    });
  });
});
