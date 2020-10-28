import React from 'react';
import { shallow } from 'enzyme';
import VolumeMeter from 'components/VolumeMeter.js';

describe('<VolumeMeter />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<VolumeMeter />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "volumemeter-component"', function () {
      expect(component.hasClass('volumemeter-component')).to.equal(true);
    });
  });
});
