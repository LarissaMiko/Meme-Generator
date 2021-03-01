import React, {useState} from "react";
import axios from "axios";
import "./MemeTile.css";
import { FaThumbsDown, FaThumbsUp, FaEye, FaDownload } from "react-icons/fa";
import { GiSpeaker} from "react-icons/gi";
import {Form, Card, Row, Col} from "react-bootstrap";
import { BASE_API_URL } from "../../config";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
import Speech from 'react-speech';
import { useAuth } from "../../context/auth";
import { FRONTEND_URL } from '../../config';



const MemeTile = (props) => {
 
  const currentMeme = props.meme;
  const dataSlide = props.dataSlide;
  
  // user should only be able to vote once
  const [newLike, setNewLike] = useState(0);
  // account-bound-votes
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  const { authTokens, userid } = useAuth();

  // direction = -1 => downvote, direction = 1 => upvote
  const handleVote = (direction) => {
    axios({
      method: "put",
      url: BASE_API_URL + "/vote/",
      data: {
        memeid: currentMeme.memeid,
        vote: direction,
        userid: authTokens ? userid : null},
      })
      .catch(function (err) {
          //handle error
          console.log(err);
      });

      direction === 1 ? currentMeme.upvotes += 1 : currentMeme.downvotes += 1;

      if(authTokens){
        direction === 1 ? setUpvoted(true) : setDownvoted(true);
      }
      setNewLike(1);
  }

  //download meme on overview site
  const downloadMeme = () => {
      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = currentMeme.imgBase64;
      link.click();
  };

  const showCategories = () => {
    if(currentMeme.categories && currentMeme.categories !== "") {
      const categories = currentMeme.categories.split(",");
      return categories.map((category, i) => <div className="category-tile m-1 p-2" key={i}>{category}</div>);
    }
  }
  const clickChange = () =>{ 
    props.handleChange(props.dataSlide, props.meme);
  }
  
  return (
    <Card className="meme-tile"  data-test="component-memeTile-selection">
        <Card.Img variant="top" src={currentMeme.imgBase64} data-target="#galleryCarousel" data-slide-to={dataSlide} onClick={clickChange}/>
      <Card.Body data-test="test-cardbody">
        <div className="d-flex flex-row align-items-center justify-content-center" data-test="test-cardbody-div">
          <div className="bg-dark audio-icon mr-2"><GiSpeaker className="download-icon"></GiSpeaker>
          <Speech text={currentMeme.title? currentMeme.title : "No title"} lang ="EN-GB" voice="Google UK English Female"></Speech>
          </div>
          <Card.Title 
            className="text-center pr-4" 
            aria-live="polite"
            aria-atomic="true"
            aria-relevant="additions"> 
            {currentMeme.title? currentMeme.title : "No title"} </Card.Title>
        </div>
        <div className="categories mt-4 mb-3 d-flex flex-wrap">
          {showCategories()}
        </div>
        <Row className="statistics mt-4 py-2">
          <Col className="d-flex justify-content-center align-items-center">
            <div className={`view-button bg-dark d-flex flex-column justify-content-center  align-items-center text-center`} >
              <FaEye></FaEye>
              <span className="viewed">{currentMeme.views}</span>
            </div>
          </Col>
          <Col className="text-center">
            <div 
              className={`${newLike || props.upvoted || props.downvoted ? 'disabled' : 'active-buttons'} like-button d-flex flex-column justify-content-center`} 
              onClick={() => {if(!newLike && !props.upvoted && !props.downvoted) handleVote(1)}}>
              <span className={`${newLike? '' : 'thump-up'} ${upvoted || props.upvoted ? 'upvoted' : ''}`}>
                <FaThumbsUp></FaThumbsUp>
              </span>
              <span className="like-count">{currentMeme.upvotes}</span>
            </div>
          </Col>
          <Col className="text-center">
            <div 
              className={`${newLike || props.upvoted || props.downvoted ? 'disabled' : 'active-buttons'} like-button d-flex flex-column justify-content-center`} 
              onClick={() => {if(!newLike && !props.upvoted && !props.downvoted) handleVote(-1)}}>
              <span className={`${newLike? '' : 'thump-down'} ${downvoted || props.downvoted ? 'downvoted' : ''}`}>
                <FaThumbsDown></FaThumbsDown>
              </span>
              <span className="like-count">{currentMeme.downvotes}</span>
            </div>
          </Col>
        </Row>
        <div className="mt-4 d-flex flex-row justify-content-between px-5"> 
          <div onClick={downloadMeme} className="bg-dark share-icon" data-test="test-download"><FaDownload className="download-icon"></FaDownload></div>
          {/* Share on overview site */}
          <FacebookShareButton
              className="share-button"
              url={`${FRONTEND_URL}/memes/${currentMeme.memeid}`}
              quote="check out my meme">
              <FacebookIcon round={true} size={35}></FacebookIcon>
          </FacebookShareButton>
          <TwitterShareButton
              className="share-button" 
              url={`${FRONTEND_URL}/memes/${currentMeme.memeid}`}
              quote="check out my meme">
              <TwitterIcon round={true} size={35}></TwitterIcon>
          </TwitterShareButton>
          <WhatsappShareButton 
              className="share-button"
              url={`${FRONTEND_URL}/memes/${currentMeme.memeid}`}
              quote="check out my meme">
              <WhatsappIcon round={true} size={35}></WhatsappIcon>
          </WhatsappShareButton>
        </div>
        <div className={"mt-3 d-flex justify-content-center"}>
          <Form.Check inline label="Select for download" type={'checkbox'} onChange={(e) => {
            props.onSelectDownload(e.target.checked)
          }}/>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MemeTile;