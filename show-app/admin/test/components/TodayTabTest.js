import React from 'react';
import { shallow } from 'enzyme';
import TodayTab from 'components/TodayTab.js';

describe('<TodayTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<TodayTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "todaytab-component"', function () {
      expect(component.hasClass('todaytab-component')).to.equal(true);
    });
  });
});
