import React from "react";
import {Modal, Button} from "react-bootstrap";
//import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
//import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
import { Router } from 'react-router-dom';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history'
import {AuthContext} from '../../../context/auth';

describe('ShareModal' , () => {
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

/*it('renders FB button' , () => {
  expect(wrapper.find(Modal.Footer)).toHaveLength(1);
});

it('children modals' , () => {
  expect(wrapper.find(Modal).children()).toHaveLength(3);
});

it('check quote after share' , () => {
  const actual = wrapper.find(FacebookShareButton).prop("quote");
  const actual2 = wrapper.find(TwitterShareButton).prop('quote');
  const actual3 = wrapper.find(WhatsappShareButton).prop('quote');
  const expected = 'check out my meme';
      
  expect(actual).toEqual(expected);
  expect(actual2).toEqual(expected);
  expect(actual3).toEqual(expected);
});*/

})