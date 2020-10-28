import React from 'react';
import { shallow } from 'enzyme';
import HostStage from 'components/HostStage.js';

describe('<HostStage />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<HostStage />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "hoststage-component"', function () {
      expect(component.hasClass('hoststage-component')).to.equal(true);
    });
  });
});
