import React from 'react';
import { shallow } from 'enzyme';
import BookedShowScreen from 'components/BookedShowScreen.js';

describe('<BookedShowScreen />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<BookedShowScreen />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "bookedshowscreen-component"', function () {
      expect(component.hasClass('bookedshowscreen-component')).to.equal(true);
    });
  });
});
