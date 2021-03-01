import React from "react";
import { Link } from 'react-router-dom';
import "./Menubar.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

const Menubar = () => {
  return (
    <Navbar expand="lg" variant="dark" bg="dark" data-test="component-menubar">
      <Container>
        <Navbar.Brand as={Link} to="/" 
        aria-live="polite"
        aria-atomic="true"
        aria-relevant="additions">OMM Meme-Generator</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/meme-gallery">Meme-Gallery</Nav.Link>
            <Nav.Link as={Link} to="/my-memes">My-Memes</Nav.Link>
            <Nav.Link as={Link} to="/statistics">Statistics</Nav.Link>
           </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Menubar;
