import React from 'react';
import { mount } from 'enzyme';
import { Link } from 'react-router-dom';
import MemeCommentSection from './MemeCommentSection';
import {AuthContext} from '../../context/auth';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import {Form, Button} from "react-bootstrap";


describe('MemeSingleView' , () => {
    const history = createMemoryHistory();
    const authTokens = "token";

    const wrapper = mount(
        <AuthContext.Provider value={{authTokens}}>
            <Router history={history}>
            <MemeCommentSection></MemeCommentSection>
            </Router> 
        </AuthContext.Provider>
    );

    it('wrapper has state', () => {
        expect(wrapper.state())
    });

    it('renders form', () => {
        expect(wrapper.find(Form)).toHaveLength(1);
    });

    it('renders Button', () => {
        expect(wrapper.find(Button)).toHaveLength(1);
    });

    it('Placeholder should go have text "Enter comment"' , () => {
        expect(wrapper.find(Form.Control).prop('placeholder')).toBe('Enter comment');
    });

    it('check Button text', () => {
        expect(wrapper.find(Button).text()).toEqual(' Submit ');
    });
});