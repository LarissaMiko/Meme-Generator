import React, { useState } from "react";
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import "./SignIn.css";
import {Form, Button} from "react-bootstrap";
import { useAuth } from "../../context/auth";
import { BASE_API_URL } from "../../config";
 
const SignIn = () => {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAuthTokens } = useAuth();

  const postLogin = (e) => {
      e.preventDefault();

      axios.post(BASE_API_URL + "/auth/login", {
          email,
          password
      }).then( res => {
          if(res.status === 200) {
              setAuthTokens(res.data);
              setLoggedIn(true);
          } else {
              setIsError(true);
          }
      }).catch( err => {
        setIsError(true)
      })
  }

  if(isLoggedIn){
      return <Redirect to="/my-memes"></Redirect>
  }
    
  return (
    <div className="page d-flex justify-content-center align-items-center" data-test="component-signin">
        <div className="form-container">
            <h4 className="font-weight-bold">Login: </h4>
            <Form>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email"
                        value={email}
                        onChange={ (e) => {setEmail(e.target.value)}} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={ (e) => {setPassword(e.target.value)}} />
                </Form.Group>
                <br></br>
                { isError &&<p className="text-danger"> The username or password provided were incorrect! </p>}
                <Button className="mb-2" variant="primary" type="submit" onClick={postLogin}>
                    Sign In
                </Button>
                <br></br>
                <Link className="btn btn-dark" to="/signup">Don't have an account?</Link>
            </Form>
        </div>
    </div>
  );
};

export default SignIn;