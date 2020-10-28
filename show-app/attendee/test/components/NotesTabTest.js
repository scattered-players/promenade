import React from 'react';
import { shallow } from 'enzyme';
import NotesTab from 'components/NotesTab.js';

describe('<NotesTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<NotesTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "notestab-component"', function () {
      expect(component.hasClass('notestab-component')).to.equal(true);
    });
  });
});
