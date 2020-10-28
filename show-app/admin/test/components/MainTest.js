import React from 'react';
import { shallow } from 'enzyme';
import Main from 'components/Main.js';

describe('<Main />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Main />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "main-component"', function () {
      expect(component.hasClass('main-component')).to.equal(true);
    });
  });
});
