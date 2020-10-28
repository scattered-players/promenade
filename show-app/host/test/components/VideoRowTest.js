import React from 'react';
import { shallow } from 'enzyme';
import VideoRow from 'components/VideoRow.js';

describe('<VideoRow />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<VideoRow />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "videorow-component"', function () {
      expect(component.hasClass('videorow-component')).to.equal(true);
    });
  });
});
