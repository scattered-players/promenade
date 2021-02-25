import React from 'react';
import { shallow } from 'enzyme';
import PhasesTab from 'components/PhasesTab.js';

describe('<PhasesTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<PhasesTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "phasestab-component"', function () {
      expect(component.hasClass('phasestab-component')).to.equal(true);
    });
  });
});
