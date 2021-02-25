import React from 'react';
import { shallow } from 'enzyme';
import BotsTab from 'components/BotsTab.js';

describe('<BotsTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<BotsTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "botstab-component"', function () {
      expect(component.hasClass('botstab-component')).to.equal(true);
    });
  });
});
