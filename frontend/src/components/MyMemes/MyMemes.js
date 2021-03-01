import React from "react";
import "./MyMemes.css";
import { useAuth } from "../../context/auth";
import {Container , Button} from "react-bootstrap";
import MemeGallery from '../MemeGallery/MemeGallery';

const MyMemes = (props) => {
    
   const { setAuthTokens, userName, userid } = useAuth();

   const logOut = () => {
       setAuthTokens(null);
   }

  return (
    <Container className="mymeme-container mt-5" data-test="component-myMeme-selection">
        <div className="d-flex justify-content-end">
            <Button 
                className="mt-5"  
                variant="outline-danger" 
                onClick={logOut}>Log out</Button>
        </div>
        
        <h3 className="text-center">Hi {userName}! Check out the memes, that you created!</h3>
        { userid ? <MemeGallery endpoint={`/memes/users/${userid}`}></MemeGallery> : <p>No userId</p>}
    </Container>
  );
};

export default MyMemes;