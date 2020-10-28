import React from 'react';
import { shallow } from 'enzyme';
import AttendeeVideoFeed from 'components/AttendeeVideoFeed.js';

describe('<AttendeeVideoFeed />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<AttendeeVideoFeed />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "attendeevideofeed-component"', function () {
      expect(component.hasClass('attendeevideofeed-component')).to.equal(true);
    });
  });
});
