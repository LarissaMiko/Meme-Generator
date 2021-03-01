import React, { useState } from "react";
import { BrowserRouter as Router, Route} from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";

import { AuthContext } from "./context/auth";

//components
import Menubar from "./components/Menubar/Menubar";
import MemeGenerator from "./components/MemeGenerator/MemeGenerator";
import MemeGallery from "./components/MemeGallery/MemeGallery";
import MyMemes from "./components/MyMemes/MyMemes";
import MemeSingleView from './components/MemeSingleView/MemeSingleView';
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import PrivateRoute from "./PrivateRoute";
import Statistics from "./components/Statistics/Statistics";
import Speech from 'react-speech';

function App() {

  // authentication - save token, userName and email to local storage
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const existingUserid = JSON.parse(localStorage.getItem("userid"));
  const existingName = JSON.parse(localStorage.getItem("name"));

  const [authTokens, setAuthTokens] = useState(existingTokens);
  const [userid, setUserid] = useState(existingUserid);
  const [userName, setUserName] = useState(existingName);
  const [userEmail, setUserEmail] = useState(existingName);

  const setTokens = (data) => {
    if (data != null){
      localStorage.setItem("tokens", JSON.stringify(data.token));
      localStorage.setItem("userid", JSON.stringify(data.userid));
      localStorage.setItem("email", JSON.stringify(data.email));
      localStorage.setItem("name", JSON.stringify(data.name));
      setAuthTokens(data.token);
      setUserid(data.userid);
      setUserName(data.name);
      setUserEmail(data.email);
    }
    else{
      localStorage.setItem("tokens", null);
      localStorage.setItem("userid", null);
      localStorage.setItem("email", null);
      localStorage.setItem("name", null);
      setAuthTokens(null);
      setUserid(null);
      setUserName(null);
      setUserEmail(null);
    }
  }

  return (
    // value of Provider determines whether or not user is authenticated
    // any component using AuthContect can get and set tokens
    <AuthContext.Provider value={{authTokens, setAuthTokens: setTokens, userName, userEmail, userid}}>
      <Router>
        <div className="App">
          <Menubar></Menubar>
          <Route exact path='/'>
          <Speech 
            text="Choose an image and add captions to create your own meme!" 
            lang ="EN-GB" voice="Google UK English Female"/>
            <h3 className="text-center" alt="Choose an image and add captions to create your own meme!"
            aria-live="polite"
            aria-atomic="true"
            aria-relevant="additions">
                Choose an image and add captions to create your own meme!
            </h3>
            <Container className="mt-5 full-height">
              <MemeGenerator></MemeGenerator>
            </Container>
          </Route>
          <Route path="/meme-gallery">
            <MemeGallery endpoint="/memes/"></MemeGallery>
          </Route>
          <Route path="/memes/:id">
            <MemeSingleView></MemeSingleView>
          </Route>
          <Route path="/login" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          {/* PrivateRoute should only be accesible when user is logged in */}
          <PrivateRoute path="/my-memes" component={MyMemes}></PrivateRoute>
          <Route path="/statistics">
            <Statistics></Statistics>
          </Route>
          <Container fluid className="footerContent bg-dark">
            <p>&copy; &nbsp; Meme-Generator 2021</p>
          </Container>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
