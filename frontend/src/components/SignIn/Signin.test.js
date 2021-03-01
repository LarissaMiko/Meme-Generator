import React from 'react';
import { Router, Link } from 'react-router-dom';
import { createMemoryHistory } from 'history'
import { mount } from 'enzyme';
import SignIn from './SignIn';
import {AuthContext} from '../../context/auth';
import {Button, Form} from "react-bootstrap";

describe('Menubar' , () => {
    const history = createMemoryHistory();
    const authTokens = "token";
    
    const wrapper = mount(
        <AuthContext.Provider value={{authTokens}}>
            <Router history={history}>
                <SignIn/>
            </Router>
        </AuthContext.Provider>
     );

    it('renders without error' , () => {
        expect(wrapper.find("[data-test='component-signin']")).toHaveLength(1);
    });
    it('should render two text-inputs', () => {
        expect(wrapper.find(Form.Control)).toHaveLength(2);
    })
    it('renders signin-button', () => {
        expect(wrapper.find(Button).text()).toBe('Sign In');
    })
    it('Link should go to Sign-up page' , () => {
       expect(wrapper.find(Link).first().prop('to')).toBe('/signup');
    });

    it('wrapper has state', () => {
        expect(wrapper.state())
    });
});