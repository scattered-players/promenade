import React from 'react';
import { shallow } from 'enzyme';
import PlaceTab from 'components/PlaceTab.js';

describe('<PlaceTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<PlaceTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "placetab-component"', function () {
      expect(component.hasClass('placetab-component')).to.equal(true);
    });
  });
});
