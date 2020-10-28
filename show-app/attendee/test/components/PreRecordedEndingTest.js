import React from 'react';
import { shallow } from 'enzyme';
import PreRecordedEnding from 'components/PreRecordedEnding.js';

describe('<PreRecordedEnding />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<PreRecordedEnding />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "prerecordedending-component"', function () {
      expect(component.hasClass('prerecordedending-component')).to.equal(true);
    });
  });
});
