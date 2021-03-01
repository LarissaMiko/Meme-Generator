import React from 'react';
import { mount } from 'enzyme';
import { shallow } from 'enzyme';
import MyMemes from './MyMemes';
import {AuthContext} from '../../context/auth';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import {Container , Button} from "react-bootstrap";


describe('MyMemes' , () => {
    const history = createMemoryHistory();
    const authTokens = "token";

    const wrapper = mount(
        <AuthContext.Provider value={{authTokens}}>
            <Router history={history}>
            <MyMemes></MyMemes>
            </Router> 
        </AuthContext.Provider>
    );
  /*  it('renders without error', () => {
        expect(wrapper.find("[data-test='component-myMeme-selection']")).toHaveLength(1);
    });*/

    it('renders Container', () => {
        expect(wrapper.find(Container)).toHaveLength(1);
    });

    it('renders Button', () => {
        expect(wrapper.find(Button)).toHaveLength(1);
    });
    
    it('check Button text', () => {
        expect(wrapper.find(Button).text()).toEqual('Log out');
    });

    it('check Container className', () => {
        expect(wrapper.find(Container).prop('className')).toEqual('mymeme-container mt-5');
    });

    it('check headline text', () => {
        expect(wrapper.find('h3').text()).toEqual('Hi ! Check out the memes, that you created!');
    });

    it('simulate button click', () => {
        const mockCallBack = jest.fn();
        const button = shallow((<Button onClick={mockCallBack}>Log out</Button>));
        button.find('button').simulate('click');
        expect(mockCallBack.mock.calls.length).toEqual(1);
    });

    it('wrapper has state', () => {
        expect(wrapper.state())
    });
});