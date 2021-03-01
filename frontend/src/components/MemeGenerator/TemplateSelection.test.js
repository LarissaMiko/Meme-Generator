import React from 'react';
import {shallow} from 'enzyme';
import TemplateSelection from './TemplateSelection';
import { Tab } from "react-bootstrap";

describe('MemeGenerator' , () => {
    const wrapper = shallow(
        <TemplateSelection/>
    );

    it('renders without error' , () => {
        expect(wrapper.find("[data-test='component-template-selection']")).toHaveLength(1);
    }
    );

    it('renders template-selection' , () => {
        expect(wrapper.find(Tab)).toHaveLength(5);
    });

  
});