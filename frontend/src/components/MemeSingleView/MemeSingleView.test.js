import React from 'react';
import { mount } from 'enzyme';
import MemeSingleView from './MemeSingleView';
import {AuthContext} from '../../context/auth';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

describe('MemeSingleView' , () => {
    const history = createMemoryHistory();
    const authTokens = "token";

    const wrapper = mount(
        <AuthContext.Provider value={{authTokens}}>
            <Router history={history}>
            <MemeSingleView></MemeSingleView>
            </Router> 
        </AuthContext.Provider>
    );
    it('renders without error', () => {
        expect(wrapper.find("[data-test='component-MemeSingleView-selection']")).toHaveLength(1);
    });

    it('renders div', () => {
        expect(wrapper.find('div').text()).toEqual('No meme found');
    });

    it('check className of div', () => {
        expect(wrapper.find('div').prop('className')).toEqual('meme-container pt-5 text-center');
    });

    it('wrapper has state', () => {
        expect(wrapper.state())
    });
});