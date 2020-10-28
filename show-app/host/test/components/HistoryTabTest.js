import React from 'react';
import { shallow } from 'enzyme';
import HistoryTab from 'components/HistoryTab.js';

describe('<HistoryTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<HistoryTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "historytab-component"', function () {
      expect(component.hasClass('historytab-component')).to.equal(true);
    });
  });
});
