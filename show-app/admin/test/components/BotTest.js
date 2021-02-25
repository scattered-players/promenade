import React from 'react';
import { shallow } from 'enzyme';
import Bot from 'components/Bot.js';

describe('<Bot />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<Bot />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "bot-component"', function () {
      expect(component.hasClass('bot-component')).to.equal(true);
    });
  });
});
