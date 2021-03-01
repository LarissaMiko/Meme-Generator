import React from 'react';
import { Router, Link } from 'react-router-dom';
import { createMemoryHistory } from 'history'
import { mount } from 'enzyme';
import SignUp from './SignUp';
import {AuthContext} from '../../context/auth';
import {Button, Form} from "react-bootstrap";
import { shallow } from 'enzyme';

describe('Menubar' , () => {
    const history = createMemoryHistory();
    const authTokens = "token";
    
    const wrapper = mount(
        <AuthContext.Provider value={{authTokens}}>
            <Router history={history}>
                <SignUp/>
            </Router>
        </AuthContext.Provider>
     );

    it('renders without error' , () => {
        expect(wrapper.find("[data-test='component-signup']")).toHaveLength(1);
    });
    it('should render four text-inputs', () => {
        expect(wrapper.find(Form.Control)).toHaveLength(4);
    })
    it('renders signin-button', () => {
        expect(wrapper.find(Button).text()).toBe('Sign Up');
    })
    it('Link should go to Sign-up page' , () => {
       expect(wrapper.find(Link).first().prop('to')).toBe('/login');
    });
    it('text of headline' , () => {
        expect(wrapper.find('h4').text()).toBe('Sign Up: ');
     });
     it('renders form.group' , () => {
        expect(wrapper.find(Form.Group)).toHaveLength(4);
     });
     it('simulate button click', () => {
        const mockCallBack = jest.fn();
        const button = shallow((<Button onClick={mockCallBack}>Sign Up</Button>));
        button.find('button').simulate('click');
        expect(mockCallBack.mock.calls.length).toEqual(1);
    });
    it('text of Link' , () => {
        expect(wrapper.find(Link).text()).toBe('Already have an account?');
     });

     it('check text of first Form.Label', () => {
        expect(wrapper.find(Form.Label).at(0).text()).toEqual('Email address:');
    });
    it('check text of second Form.Label', () => {
        expect(wrapper.find(Form.Label).at(1).text()).toEqual('Name:');
    });
    it('check text of third Form.Label', () => {
        expect(wrapper.find(Form.Label).at(2).text()).toEqual('Password:');
    });
    it('check text of fourth Form.Label', () => {
        expect(wrapper.find(Form.Label).at(3).text()).toEqual('Repeat Password');
    });

    it('wrapper has state', () => {
        expect(wrapper.state())
    });
});