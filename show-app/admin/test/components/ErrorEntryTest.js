import React from 'react';
import { shallow } from 'enzyme';
import ErrorEntry from 'components/ErrorEntry.js';

describe('<ErrorEntry />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<ErrorEntry />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "errorentry-component"', function () {
      expect(component.hasClass('errorentry-component')).to.equal(true);
    });
  });
});
