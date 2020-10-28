import React from 'react';
import { shallow } from 'enzyme';
import PlaceMesh from 'components/PlaceMesh.js';

describe('<PlaceMesh />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<PlaceMesh />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "placemesh-component"', function () {
      expect(component.hasClass('placemesh-component')).to.equal(true);
    });
  });
});
