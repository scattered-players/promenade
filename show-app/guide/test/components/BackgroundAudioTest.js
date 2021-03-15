import React from 'react';
import { shallow } from 'enzyme';
import BackgroundAudio from 'components/BackgroundAudio.js';

describe('<BackgroundAudio />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<BackgroundAudio />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "backgroundaudio-component"', function () {
      expect(component.hasClass('backgroundaudio-component')).to.equal(true);
    });
  });
});
