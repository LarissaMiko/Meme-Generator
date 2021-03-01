import React from 'react';
import { shallow } from 'enzyme';
import Nav from "react-bootstrap/Nav";
import Menubar from './Menubar';

describe('Menubar' , () => {
    
    const wrapper = shallow(
        <Menubar/>
     );

    it('renders without error' , () => {
        expect(wrapper.find("[data-test='component-menubar']")).toHaveLength(1);
    });
    it('renders three Navlinks' , () => {
        expect(wrapper.find(Nav.Link)).toHaveLength(3);
    });
    it('first link leads to home-page', () => {
        expect(wrapper.find(Nav.Link).first().prop('to')).toBe('/')
    });

    
});