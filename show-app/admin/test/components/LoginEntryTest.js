import React from 'react';
import { shallow } from 'enzyme';
import LoginEntry from 'components/LoginEntry.js';

describe('<LoginEntry />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<LoginEntry />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "loginentry-component"', function () {
      expect(component.hasClass('loginentry-component')).to.equal(true);
    });
  });
});
