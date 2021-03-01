import React from 'react';

import * as reactModule from "react";
import { mount } from 'enzyme';
import MemeCarousel from './MemeCarousel';
import {AuthContext} from '../../context/auth';
import {Carousel, Tabs} from "react-bootstrap";
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

describe('MemeGallery' , () => {
    const history = createMemoryHistory();
    const authTokens = "token";
    const active = 1;
    const play = false;
    const memes = [];
 /*    let wrapper;
    let memes;
    beforeEach(() => {
        memes = jest.fn(x => {});
       // useStateSpy = jest.spyOn(React, 'useState');
       // useStateSpy.mockImplementation((init) => [init, memes]);
        reactModule.useState = jest
            .fn()
            .mockImplementationOnce(x => [x, memes]);
      
        wrapper = mount(
            <AuthContext.Provider value={{authTokens}}>
                <Router history={history}>
                <MemeCarousel memes={{memes}} active={{active}} handleChange={[]} play={{play}}/>
                </Router> 
            </AuthContext.Provider>
        );
    });*/
    const wrapper = mount(
        <AuthContext.Provider value={{authTokens}}>
            <Router history={history}>
            <MemeCarousel memes={{memes}} active={{active}} handleChange={[]} play={{play}}/>
            </Router> 
        </AuthContext.Provider>
    );

    it('renders without error', () => {
        expect(wrapper.find("[data-test='component-memeCarousel-selection']")).toHaveLength(1);
    });

    it('renders memeCarousel-selection' , () => {
        expect(wrapper.find(<Carousel activeIndex={{active}}/>)).toHaveLength(1);
    });
    
    it('Carousel should have id of galleryCarousel', () => {
        const id = wrapper.find(Carousel).prop('id');
        const expected = 'galleryCarousel';
        expect(id).toEqual(expected);
       });

    it('show title, created, upvotes, downvotes, views and categories while memecarousel', () => {
        const span = wrapper.find(Carousel.Item).props('span');
        const expected = "Title:"
        expect(span).toEqual(expected);
    });

    it('render span length', () => {
        expect(wrapper.find('span')).toHaveLength(6);
    });

    it('check first title of span', () => {
        expect(wrapper.find('span').at(0).text()).toEqual('Title:');
    });

    it('check second title of span', () => {
        expect(wrapper.find('span').at(1).text()).toEqual('Created:');
    });

    it('wrapper has state', () => {
        expect(wrapper.state())
    });

    it('check third title of span', () => {
        expect(wrapper.find('span').at(2).text()).toEqual('Upvotes:');
    });

});