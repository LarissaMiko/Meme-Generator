import React from "react";
import { Router } from 'react-router-dom';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history'
import MemeGallery from './MemeGallery';
import {AuthContext} from '../../context/auth';
import {Container, Row, Col, Form, Modal, Button, InputGroup} from "react-bootstrap";
import { Link } from 'react-router-dom';
//import MemeTile from "../MemeTile/MemeTile.js";

describe('MemeGallery' , () => {
    const history = createMemoryHistory();
    const authTokens = "token";
   
    const wrapper = mount(
        <AuthContext.Provider value={{authTokens}}>
            <Router history={history}>
                <MemeGallery/>
            </Router> 
        </AuthContext.Provider>
    );

    it('renders one Modal' , () => {
        expect(wrapper.find(Modal)).toHaveLength(1);
    });

    it('renders two Row' , () => {
        expect(wrapper.find(Row)).toHaveLength(2);
    });

    it('renders three Col' , () => {
        expect(wrapper.find(Col)).toHaveLength(3);
    });

    it('renders four Form.Control', () => {
        expect(wrapper.find(Form.Control)).toHaveLength(4);
    });

    it('renders h1', () => {
        expect(wrapper.find('h1')).toHaveLength(1);
    });

    it('renders text of h1', () => {
        expect(wrapper.find('h1').text()).toEqual('Meme-Gallery');
    });

    it('renders Form.Label', () => {
        expect(wrapper.find(Form.Label)).toHaveLength(2);
    });
    
    it('renders Form.Check', () => {
        expect(wrapper.find(Form.Check)).toHaveLength(7);   
    });

    it('renders Buttons', () => {
        expect(wrapper.find(Button)).toHaveLength(2);
    });

    it('renders text of first button', () => {
        expect(wrapper.find(Button).first().text()).toEqual('Download shown memes!');
    });

    it('renders Link', () => {
        expect(wrapper.find(Link)).toHaveLength(1);
        expect(wrapper.find(Link).text()).toEqual('Generate a meme!');
        expect(wrapper.find(Link).prop('to')).toBe('/')
    });

    it('renders text of Link', () => {
        expect(wrapper.find(Link).text()).toEqual('Generate a meme!');
    });

    it('path of Link to homepage', () => {
        expect(wrapper.find(Link).prop('to')).toBe('/');
    });

    it('modal is closed before button is clicked', () => {
        expect(wrapper.find(Modal).prop('show')).toBe(false);
    });

    it('renders container' , () => {
        expect(wrapper.find(Container)).toHaveLength(1);
    });

    it('renders inputgroup' , () => {
        expect(wrapper.find(InputGroup)).toHaveLength(1);
    });

    it('renders option' , () => {
        expect(wrapper.find('option')).toHaveLength(6);
    });

    it('check className of second Form.Control' , () => {
        const actual = wrapper.find(Form.Control).at(1).prop('className');
        const expected = 'sort-select';
        expect(actual).toEqual(expected);
    });

    it('check className of third Form.Control' , () => {
        const actual = wrapper.find(Form.Control).at(2).prop('className');
        const expected = 'search-field';
        expect(actual).toEqual(expected);
    });

    it('check id for Form.Check' , () => {
        const actual = wrapper.find(Form.Check).at(6).prop('id');
        const expected = 'inline-checkbox-animals';
        expect(actual).toEqual(expected);
    });

    it('check label of first Form.Check' , () => {
        expect(wrapper.find(Form.Check).at(0).prop('label')).toEqual('Nature');
    });

    it('check label of second Form.Check' , () => {
        expect(wrapper.find(Form.Check).at(1).prop('label')).toEqual('Travel');
    });

    it('check label of third Form.Check' , () => {
        expect(wrapper.find(Form.Check).at(2).prop('label')).toEqual('Animals');
    });

    it('check label of forth Form.Check' , () => {
        expect(wrapper.find(Form.Check).at(3).prop('label')).toEqual('Sports');
    });

    it('check label of fourth Form.Check' , () => {
        expect(wrapper.find(Form.Check).at(4).prop('label')).toEqual('Urban');
    });

    it('check label of fifth Form.Check' , () => {
        expect(wrapper.find(Form.Check).at(5).prop('label')).toEqual('Work');
    });       
});


