import React from 'react';
import { shallow } from 'enzyme';
import RemoteFeed from 'components/RemoteFeed.js';

describe('<RemoteFeed />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<RemoteFeed />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "remotefeed-component"', function () {
      expect(component.hasClass('remotefeed-component')).to.equal(true);
    });
  });
});
