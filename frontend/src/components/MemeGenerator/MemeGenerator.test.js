import React from 'react';
import { Router } from 'react-router-dom';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history'
import MemeGenerator from './MemeGenerator';
import {AuthContext} from '../../context/auth';

describe('MemeGenerator' , () => {
    const history = createMemoryHistory();
    const authTokens = "token"
        const wrapper = mount(
            <AuthContext.Provider value={{authTokens}}>
                <Router history={history}>
                    <MemeGenerator/>
                </Router> 
            </AuthContext.Provider>
        );

        it('wrapper has state', () => {
            expect(wrapper.state());
        });
    /*it('renders without error' , () => {
        expect(wrapper.find("[data-test='component-meme-generator']")).toHaveLength(1);
    }
    );
    */

   it('renders three CaptionModal' , () => {
    expect(wrapper.find(CaptionModal)).toHaveLength(3);
    });

    it('renders one ShareModal' , () => {
    expect(wrapper.find(ShareModal)).toHaveLength(1);
    });

    it('renders one ButtonToolbar' , () => {
    expect(wrapper.find(ButtonToolbar)).toHaveLength(1);
    });

    it('renders three Draggable' , () => {
    expect(wrapper.find(Draggable)).toHaveLength(3);
    });

    it('renders one Form' , () => {
    expect(wrapper.find(Form)).toHaveLength(3);
    });
}); 