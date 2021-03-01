import React, { useState } from "react";
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import "./SignUp.css";
import {Form, Button} from "react-bootstrap";
import { useAuth } from "../../context/auth";
import { BASE_API_URL } from "../../config";

const SignUp = () => {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [uncompleteError, setUncompleteError] = useState(false)

  const { setAuthTokens } = useAuth();

  const postSignUp = (e) => {
    e.preventDefault();
    if(email === "" || password === "" ){
        setUncompleteError(true);
    }
    else if(password === checkPassword){
        setIsPasswordError(false);
        setUncompleteError(false);

        axios.post(BASE_API_URL + "/auth/signup", {
            email,
            name,
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
            });

    } else {
        setIsPasswordError(true);
    }}

    if(isLoggedIn){
        return <Redirect to="/my-memes"></Redirect>
    }

  return (
    <div className="page d-flex justify-content-center align-items-center" data-test="component-signup">
        <div className="form-container mt-5">
            <h4 className="font-weight-bold">Sign Up: </h4>
            <Form>
                <Form.Group>
                    <Form.Label>Email address:</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => {setEmail(e.target.value)}} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Name:</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => {setName(e.target.value)}} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value)}} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Repeat Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Repeat Password"
                        value={checkPassword}
                        onChange={(e) => {setCheckPassword(e.target.value)}} />
                </Form.Group>
                <p className={`${uncompleteError ? '' : 'd-none'} text-danger`}>Please enter your E-mail, name and choose a password!</p>
                <p className={`${isPasswordError ? '' : 'd-none'} text-danger`}>Passwords are not matching!</p>
                { isError &&<p className="text-danger"> Oh no! Something went wrong during the Signup-process  </p>}
                <br></br>
                <Button className="mb-2" variant="primary" type="submit" onClick={postSignUp}>
                    Sign Up
                </Button>
                <br></br>
                <Link className="btn btn-dark" to="/login">Already have an account?</Link>
            </Form>
        </div>
    </div>
  );
};

export default SignUp;