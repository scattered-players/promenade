import React from 'react';
import { shallow } from 'enzyme';
import PartyTab from 'components/PartyTab.js';

describe('<PartyTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<PartyTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "partytab-component"', function () {
      expect(component.hasClass('partytab-component')).to.equal(true);
    });
  });
});
