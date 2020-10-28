import React from 'react';
import { shallow } from 'enzyme';
import GuidesTab from 'components/GuidesTab.js';

describe('<GuidesTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<GuidesTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "guidestab-component"', function () {
      expect(component.hasClass('guidestab-component')).to.equal(true);
    });
  });
});
