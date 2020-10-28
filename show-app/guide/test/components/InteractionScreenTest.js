import React from 'react';
import { shallow } from 'enzyme';
import InteractionScreen from 'components/InteractionScreen.js';

describe('<InteractionScreen />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<InteractionScreen />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "interactionscreen-component"', function () {
      expect(component.hasClass('interactionscreen-component')).to.equal(true);
    });
  });
});
