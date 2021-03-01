import React from "react";
import {Modal, Button} from "react-bootstrap";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";

const ShareModal = (props) => {

  return (
    <Modal show={props.show} onHide={props.onSetShowFalse}>
        <Modal.Header closeButton>
        <Modal.Title>Meme saved in database!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p> Share your meme!</p>
            <FacebookShareButton
                url={props.url}
                quote="check out my meme">
                <FacebookIcon  round={true}/>
            </FacebookShareButton>
            <TwitterShareButton
                url={props.url}
                quote="check out my meme">
                <TwitterIcon logoFillColor="white" round={true}/>
            </TwitterShareButton>
            <WhatsappShareButton
                url={props.url}
                quote="check out my meme">
                <WhatsappIcon logoFillColor="white" round={true}/>
            </WhatsappShareButton>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.onSetShowFalse}>Close</Button>
        </Modal.Footer>
    </Modal>
    
  );
};

export default ShareModal;