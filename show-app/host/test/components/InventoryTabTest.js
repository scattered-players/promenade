import React from 'react';
import { shallow } from 'enzyme';
import InventoryTab from 'components/InventoryTab.js';

describe('<InventoryTab />', function () {

  let component;
  beforeEach(function () {
    component = shallow(<InventoryTab />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "inventorytab-component"', function () {
      expect(component.hasClass('inventorytab-component')).to.equal(true);
    });
  });
});
