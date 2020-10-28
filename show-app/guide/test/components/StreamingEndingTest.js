import React from 'react';
import { shallow } from 'enzyme';
import StreamingEnding from 'components/StreamingEnding.js';

describe('<StreamingEnding />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<StreamingEnding />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "streamingending-component"', function () {
      expect(component.hasClass('streamingending-component')).to.equal(true);
    });
  });
});
