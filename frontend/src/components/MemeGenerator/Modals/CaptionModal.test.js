import React from "react";
import {Modal, FormControl, Button, Dropdown, DropdownButton, InputGroup, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
//import CaptionModal from "./CaptionModal";
import { Router } from 'react-router-dom';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history'
import {AuthContext} from '../../../context/auth';

describe('CaptionModal' , () => {
    const history = createMemoryHistory();
    const authTokens = "token";
   
    const wrapper = mount(
        <AuthContext.Provider value={{authTokens}}>
            <Router history={history}>
                <Modal/>
            </Router> 
        </AuthContext.Provider>
    );

    it('renders Modal' , () => {
        expect(wrapper.find(Modal)).toHaveLength(1);
    });

    /*it('children modals' , () => {
        expect(wrapper.find(Modal).children()).toHaveLength(3);
      });*/

})