import React from 'react';
import { shallow } from 'enzyme';
import CurrentShowTab from 'components/CurrentShowTab.js';

describe('<CurrentShowTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<CurrentShowTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "currentshowtab-component"', function () {
      expect(component.hasClass('currentshowtab-component')).to.equal(true);
    });
  });
});
