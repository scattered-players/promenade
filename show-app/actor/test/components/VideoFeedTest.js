import React from 'react';
import { shallow } from 'enzyme';
import VideoFeed from 'components/VideoFeed.js';

describe('<VideoFeed />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<VideoFeed />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "videofeed-component"', function () {
      expect(component.hasClass('videofeed-component')).to.equal(true);
    });
  });
});
