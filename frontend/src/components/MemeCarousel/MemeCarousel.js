import React, {useCallback} from "react";
import "./MemeCarousel.css";
import {Carousel} from "react-bootstrap";
import MemeCommentSection from '../MemeCommentSection/MemeCommentSection'; 

const MemeCarousel = (props) => {
  const memes = props.memes;
  console.log(props.active)
  const interval = props.play ? 1000 : 100000000000;
  const createCarouselItems = useCallback(() => {
    return memes.map((meme, i) => {
        return(
            <Carousel.Item key={i} interval={interval}>
                <img
                className="d-block w-100"
                src={meme.imgBase64}
                alt={`${meme.title ? meme.title : 'no-title'}`}
                />
                <div className="mt-2">
                    <p>
                     <span className="font-weight-bold">Title:</span>   {`${meme.title ? meme.title : 'No title'}`} <br/>
                     <span className="font-weight-bold">Created:</span> {`${meme.created ? new Date (meme.created).toLocaleDateString() : 'Unknown'}`} <br/>
                     <span className="mr-2"><span className="font-weight-bold">Upvotes:</span>  {meme.upvotes || '0'} </span>
                     <span className="font-weight-bold">Downvotes:</span> {meme.downvotes || '0'} <br/>
                     <span className="font-weight-bold">Views:</span> {meme.views || '0'} <br/>
                     <span className="font-weight-bold">Categories:</span> {`${meme.categories ? meme.categories : 'None'}`}
                     </p>
                </div>
                {meme.memeid ? <MemeCommentSection memeid={meme.memeid}/> : <></>}
            </Carousel.Item>
        )
    })
  }, [memes, interval])

  return (
    <Carousel  pause="hover" id="galleryCarousel" activeIndex={props.active} onSelect={(index, e) => props.handleChange(index, e)} data-test="component-memeCarousel-selection">
        {createCarouselItems()}
    </Carousel>
  );
};

export default MemeCarousel;