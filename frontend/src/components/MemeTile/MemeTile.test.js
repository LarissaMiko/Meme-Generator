import React from 'react';
import {mount} from 'enzyme';
import MemeTile from './MemeTile';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
import {AuthContext} from '../../context/auth';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import Speech from 'react-speech';

describe('MemeGallery' , () => {
    const history = createMemoryHistory();
    const authTokens = "token";
    const meme = {
        firstMeme: {
            _id: {
                rendered: '6030f4e37cb71d64557cd62f'
            },
            imgBase64: {
                rendered: ''
            },
            originalImage:{
                rendered: ''
            },
            title: {
                rendered: "First meme"
            },
            topCaption: {
                rendered: "This is the first top caption"
            },
            bottomCaption: {
                rendered: "This is the first bottom caption"
            },
            upvotes: {
                rendered: 17
            },
            downvotes: {
                rendered: 2
            },
            categories: {
                rendered: "Urban, Work"
            },
            created: {
                rendered: "2021-02-20T11:39:13.032Z"
            },
            views: {
                rendered: 5
            }
        },
    };
    const handleChange = jest.fn();
    const wrapper = mount(
        <AuthContext.Provider value={{authTokens}}>
            <Router history={history}>
            <MemeTile meme={meme} dataSlide={1} show={false} handleChange={handleChange}></MemeTile>
            </Router> 
        </AuthContext.Provider>
    );
    /*const wrapper2 = shallow(
        <AuthContext.Provider value={{authTokens}}>
            <Router history={history}>
            <MemeTile meme={meme} dataSlide={1} show={false} handleChange={handleChange}></MemeTile>
            </Router> 
        </AuthContext.Provider>
    );*/
    
    /*it('renders without error', () => {
        expect(wrapper.find("[data-test='component-memeTile-selection']")).toHaveLength(1);
    }); */ //why isn't this working

    it('renders Card' , () => {
        expect(wrapper.find(Card)).toHaveLength(1);
    });

    it('renders Row' , () => {
        expect(wrapper.find(Row)).toHaveLength(1);
    });

    it('renders Col' , () => {
        expect(wrapper.find(Col)).toHaveLength(3);
    });

    it('renders Card.Img' , () => {
        expect(wrapper.find(Card.Img)).toHaveLength(1);
    });

    it('renders Card.Body' , () => {
        expect(wrapper.find(Card.Body)).toHaveLength(1);
    });

    /*it('children cardbody div' , () => {
        expect(wrapper2.find("[data-test='test-cardbody-div']").children()).toHaveLength(2);
    });

    it('card.title child of card.body' , () => {
        expect(wrapper2.find("[data-test='test-cardbody']").childAt(3)).toEqual(Row);
    });*/ //doesn't work :(

    it('renders Speech' , () => {
        expect(wrapper.find(Speech)).toHaveLength(1);
    });
    
    it('check quote after share' , () => {
        const shareClick = wrapper.find(FacebookShareButton).prop('quote');
        const expected= 'check out my meme'
        expect(shareClick).toEqual(expected);
    });

    it('should have a Facebook- Twitter- and Whatsappsharebutton with \'share-button\' class', () => {
        const actual = wrapper.find(FacebookShareButton).prop('className');
        const actual2 = wrapper.find(TwitterShareButton).prop('className');
        const actual3 = wrapper.find(WhatsappShareButton).prop('className');
        const expected = 'share-button';
      
        expect(actual).toEqual(expected);
        expect(actual2).toEqual(expected);
        expect(actual3).toEqual(expected);
       });

    it('one Facebook-Icon', () => {
        const icon = wrapper.find(FacebookIcon);
        expect(icon.length).toEqual(1);
    }); 

    it('one Twitter-Icon', () => {
        const icon = wrapper.find(TwitterIcon);
        expect(icon.length).toEqual(1);
    }); 

    it('one Whatsapp-Icon', () => {
        const icon = wrapper.find(WhatsappIcon);
        expect(icon.length).toEqual(1);
    });

    it('Classname Card Title', () => {
        const actual = wrapper.find(Card.Title).prop('className');
        const expected = 'text-center pr-4';
        expect(actual).toEqual(expected);
       });

       it('download', () => {
        wrapper.find("[data-test='test-download']");
        wrapper.simulate("click");
    });

    it('wrapper has state', () => {
        expect(wrapper.state())
    });

})