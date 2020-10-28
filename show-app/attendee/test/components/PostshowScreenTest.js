import React from 'react';
import { shallow } from 'enzyme';
import PostshowScreen from 'components/PostshowScreen.js';

describe('<PostshowScreen />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<PostshowScreen />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "postshowscreen-component"', function () {
      expect(component.hasClass('postshowscreen-component')).to.equal(true);
    });
  });
});
