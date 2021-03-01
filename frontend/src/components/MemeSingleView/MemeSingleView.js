import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import { Container } from "react-bootstrap";
import { useAuth } from "../../context/auth";
import { BASE_API_URL } from "../../config";
import MemeCommentSection from '../MemeCommentSection/MemeCommentSection';
import './MemeSingleView.css'
 
const MemeSingleView = () => {

  const [meme, setMeme] = useState(null);
  const { userid } = useAuth();
  
  let { id } = useParams();

  const loadMemes = useCallback(async () => {
    const res = await axios.get(BASE_API_URL + `/memes/${id}`);
    setMeme(res.data[0]);
    }, [id])

  useEffect(() => {
    loadMemes()
  }, [loadMemes])

  const renderImage = () => {
    return (meme.private === "false" || (meme.private === "true" && meme.user === userid)) ? 
    <img src={meme.imgBase64} alt={meme.title || 'meme'}></img> :
    <div>
        <p> Looks like the meme you want to see is private. If it is yours, login first</p>
        <Link className="btn btn-info btn-sm" to="/login">Log In </Link>
    </div>
  }
    
  return meme ? (
    <Container className="meme-container pt-5 text-center">
        { (meme.title) ?  <h2>{meme.title}</h2> : ''}
        {renderImage()}
        { meme.memeid ? <MemeCommentSection memeid={meme.memeid}></MemeCommentSection> : <></>}
    </Container>
  ) : 
  <div className="meme-container pt-5 text-center" data-test='component-MemeSingleView-selection'>
      <p>No meme found</p>
  </div>
  ;
};

export default MemeSingleView;