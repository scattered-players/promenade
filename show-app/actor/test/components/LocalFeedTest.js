import React from 'react';
import { shallow } from 'enzyme';
import LocalFeed from 'components/LocalFeed.js';

describe('<LocalFeed />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<LocalFeed />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "localfeed-component"', function () {
      expect(component.hasClass('localfeed-component')).to.equal(true);
    });
  });
});
