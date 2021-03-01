import React, { useState, useCallback, useMemo } from "react";
import { Link } from 'react-router-dom';
import {Form, Button} from "react-bootstrap";
import axios from 'axios';
import { useAuth } from "../../context/auth";
import { BASE_API_URL } from '../../config';
import './MemeCommentSection.css'

const MemeCommentSection = (props) => {

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const { authTokens, userName, userid } = useAuth();

  const loadComments = useCallback(async () => {
    const res = await axios.get(BASE_API_URL + `/comments/${props.memeid}`);
    setComments(res.data);
  }, [props])

  //load comments once when page is rendered
  useMemo(() => {
    loadComments();
  }, [loadComments]);

  const createComment = (comment) => {
      return(
          <div className="comment-container p-3 text-left mt-2" key={comment.created}>
              <span className="font-weight-bold text-info pr-1">{comment.userName}:</span>
              <span className="text-muted">{`${comment.created ? new Date (comment.created).toLocaleDateString() : 'Unknown'}`}</span><br></br>
              <span>{comment.text}</span>
          </div>
      )
  }

  const commentSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("userid", userid);
    data.append("userName", userName);
    data.append("text", commentText);
    data.append("created", new Date().toISOString());

    setCommentText('');
    
    axios({
      method: "post",
      url: BASE_API_URL + `/comments/${props.memeid}`,
      data: data,
      headers: {"Content-Type": "multipart/form-data" }
      })
      .then(function (response) {
          //load updated comments
          loadComments();
      })
      .catch(function (error) {
          console.log(error);
      });
  }

  return (
    <div className="comment-section mt-5 p-5">
       {authTokens ? 
       <Form>
            <Form.Group>
                <p className="text-left font-weight-bold">Write a comment:</p>
                <div className="d-flex flex-row justify-content-center">
                <Form.Control 
                    type="text" 
                    placeholder="Enter comment"
                    className="mr-1"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)} />
                <Button variant="dark" type="submit" onClick={commentSubmit}> Submit </Button>
                </div>
            </Form.Group>
        </Form> :
        <Link className="btn btn-info btn-sm" to="/login">Log In create leave a comment</Link>
        }
        <div>
            {comments.length !== 0 ? comments.map((comment) => createComment(comment)) : <p>No comments yet</p>} 
        </div> 
    </div>
  );
};

export default MemeCommentSection;