import React from 'react';
import { shallow } from 'enzyme';
import ChatTab from 'components/ChatTab.js';

describe('<ChatTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<ChatTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "chattab-component"', function () {
      expect(component.hasClass('chattab-component')).to.equal(true);
    });
  });
});
