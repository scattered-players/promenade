import React from 'react';
import { shallow } from 'enzyme';
import CharacterInfo from 'components/CharacterInfo.js';

describe('<CharacterInfo />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<CharacterInfo />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "characterinfo-component"', function () {
      expect(component.hasClass('characterinfo-component')).to.equal(true);
    });
  });
});
