import React, {useState, useMemo, useCallback, useEffect} from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import "./MemeGallery.css";
import {Container, Row, Col, Form, Modal, Button, InputGroup, FormControl} from "react-bootstrap";
import { BASE_API_URL } from "../../config";
import MemeTile from "../MemeTile/MemeTile";
import MemeCarousel from "../MemeCarousel/MemeCarousel";
import { useAuth } from "../../context/auth";

const MemeGallery = (props) => {

  const [memes, setMemes] = useState([]);
  const [filteredMemes, setFilteredMemes] = useState([]);
  const [sortedMemes, setSortedMemes] = useState([]);
  const [selectedDownload, setSelectedDownload] = useState([])
  const [sortedBy, setSortedBy] = useState("");
  const [categorySelector, setCategorySelector] = useState([]);
  const [maxDownloadNumber, setMaxDownloadNumber] = useState(100)

  const [ownCategory, setOwnCategory] = useState("");
  const [ownCategoryChecked, setOwnCategoryChecked] = useState(false);
  const [show, setShow] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselAutoplay, setCarouselAutoplay] = useState(false);
 
  //const search function
  const[searchedMemes,setSearchedMemes] = useState([]);
  const[searchQuery, setSearchQuery] = useState("");
  const [randomCarousel, setRamdomCarousel] = useState(false);

  const { authTokens, userid } = useAuth();

  const loadMemes = useCallback(async () => {
    const res = await axios.get(BASE_API_URL + props.endpoint);
    setMemes(res.data);
  }, [props.endpoint])
  
  //load memes once when page is rendered
  useMemo(() => {
    loadMemes();
  }, [loadMemes]);

//update views of clicked meme
  const handleView = (meme) => {
    axios({
      method: "put",
      url: BASE_API_URL + "/views/",
      data: {
        id: meme._id,
        views: meme.views},
      })
      .catch(function (err) {
          //handle error
          console.log(err);
      });
      meme.views = meme.views + 1;
  }

  // show slide-show with corresponding meme if meme-tile is clicked
  const handleMemeTileClick = useCallback( (index, meme) => {
    setCarouselIndex(index)
    handleView(meme);
    setShow(true);
  }, [])

  // handle select for download click
  const handleSelectDownload = useCallback((meme, selected) => {
    if (selected) {
      setSelectedDownload([...selectedDownload, meme])
    } else {
      setSelectedDownload(selectedDownload.filter(current => current._id !== meme._id))
    }
  }, [selectedDownload, setSelectedDownload])
  
  // gallery should update every time a meme is uploaded and create one tile for each meme
  const createGallery = useCallback(() => {
    // render filtered memes if filter is checked, else render whole gallery
    const galleryMemes = ((categorySelector.length > 0) || (ownCategoryChecked && ownCategory !== "") ? filteredMemes : ((searchQuery !== "")? searchedMemes : memes))
    return memes.length === 0 ?
  <div className="text-center mt-5">
    <p>Looks like there are no Memes yet - Check out the generator and create one!</p>
    <Link className="btn btn-dark mt-3" to="/">Generate a meme!</Link>
  </div> 
    : 
      <Row>
        {galleryMemes.map((meme, i) => 
        <Col xs={12} sm={6} md={4} className="my-3" key={i}>
          <MemeTile 
            meme={meme}
            upvoted={authTokens ? meme.upvotedBy?.includes(userid) : null} 
            downvoted={authTokens ? meme.downvotedBy?.includes(userid) : null} 
            dataSlide={i} 
            show={show} 
            handleChange={handleMemeTileClick}
            onSelectDownload={(selected) => {handleSelectDownload(meme, selected)}}
            />
        </Col>)}
      </Row>
  }, [filteredMemes, memes, categorySelector, ownCategory, ownCategoryChecked, show, searchQuery, searchedMemes, handleMemeTileClick, authTokens, userid, handleSelectDownload])
    
  const handleCarouselChange = (selectedIndex, e) => {
    setCarouselIndex(selectedIndex)
  }

  const createCarousel = useCallback(() => {
    const galleryMemes = (categorySelector.length > 0) || (ownCategoryChecked && ownCategory !== "") ? filteredMemes : memes;
    return <MemeCarousel 
            memes={galleryMemes} 
            active={randomCarousel ? Math.floor(Math.random() * Math.floor(galleryMemes.length - 1)) : carouselIndex} 
            handleChange={handleCarouselChange} 
            play={carouselAutoplay}> 
          </MemeCarousel>
  }, [filteredMemes, memes, ownCategory, ownCategoryChecked, categorySelector, carouselIndex, carouselAutoplay, randomCarousel])

  //trigger change of memes when filter is set
  useEffect(() => {
    setFilteredMemes(memes.filter((meme) => { 
      if(meme.categories){
        const categories = meme.categories.split(',');
        const selectors = ownCategoryChecked && ownCategory !== "" ? [...categorySelector, ownCategory] : categorySelector;
        return selectors.every((selector) => { 
          return categories.includes(selector)})
          
      } else {
        return false
      }
    }))
  }, [categorySelector, memes, ownCategory, ownCategoryChecked])

  const onCategoryChange = (category) => {
    categorySelector.includes(category)? 
    setCategorySelector(categorySelector.filter((element) => element !== category)) : 
    setCategorySelector([...categorySelector, category])
  }

  const sortMemes = (e) => {
    let sorted;

    switch(e.target.value) {
      case 'title A-Z':
        sorted = memes.sort(function(a, b) {
          if(a.title && b.title){
            return (a.title.toLowerCase() < b.title.toLowerCase() ? -1 : (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : 0));
          }
          else return 1;
        });
        break;

      case 'most popular':
        sorted = memes.sort(function(a, b) {
          return (parseInt(a.upvotes) > parseInt(b.upvotes) ? -1 : ((parseInt(a.upvotes) < parseInt(b.upvotes)) ? 1 : 0));
        });
        break;

      case 'least popular':
        sorted = memes.sort(function(a, b) {
          return (parseInt(a.downvotes) > parseInt(b.downvotes) ? -1 : ((parseInt(a.downvotes) < parseInt(b.downvotes)) ? 1 : 0));
        });
        break;

      case 'generated recently':
        sorted = memes.sort(function(a, b) {
          return (a.created > b.created ? -1 : (a.created < b.created ? 1 : 0));
        });
        break;

      case 'used template':
        sorted = memes.sort((a, b) => {
          return (a.originalImage.toLowerCase() < b.originalImage.toLowerCase() ? -1 : (a.originalImage.toLowerCase() > b.originalImage.toLowerCase() ? 1 : 0));
        });
        break;

      default:
        sorted = memes;
    }

    setSortedMemes(sorted)
    setSortedBy(e.target.value)
  };

  useEffect(() => {
    setMemes(sortedMemes)
  }, [sortedMemes, setSortedMemes, sortedBy]) 

  useEffect(() => {
    setSearchedMemes(memes.filter((meme) => {
      if(meme.title && searchQuery.length!==0){
          const titlewords = meme.title.split(',');
          const topcaptionwords = meme.topCaption.split(',');
          const bottomcaptionwords = meme.bottomCaption.split(',');
          return titlewords.map((titleword) => titleword.toLowerCase()).includes(searchQuery.toLowerCase()) || topcaptionwords.map((topcaptionword) => topcaptionword.toLowerCase()).includes(searchQuery.toLowerCase()) || bottomcaptionwords.map((bottomcaptionword)=> bottomcaptionword.toLowerCase()).includes(searchQuery.toLowerCase());
      }
      else{
        return false
      }
    }))
}, [memes,searchQuery])

  //call download all memes function
  const downloadMemes = async (selected) => {
    let memesDownload
    if (selected) {
      memesDownload = selectedDownload
    } else {
      memesDownload = ((categorySelector.length > 0) || (ownCategoryChecked && ownCategory !== "") ? filteredMemes : ((searchQuery !== "")? searchedMemes : memes))
    }
    const ids = []
    for (const meme of memesDownload.slice(0, maxDownloadNumber)) {
      ids.push(meme._id)
    }
    const res = await axios.get(BASE_API_URL + "/download",
      {responseType: 'arraybuffer', params: {ids: ids}});
    const link = document.createElement('a')
    link.download = 'Memes.zip'
    link.href = URL.createObjectURL(new Blob([res.data], {type: "application/zip"}))
    link.click()
  }

  const hideSlideshow = () => {
    setRamdomCarousel(false);
    setShow(false);
  }

  return (
    <Container className="content mt-5" data-test="component-memeGallery-selection">
        <div className={`${props.endpoint === '/memes/' ? '' : 'd-none'} text-center`}>
            <h1>Meme-Gallery</h1>
            <p>Have a look at all memes created so far and choose your favourite</p>
        </div>
        <Row className="mt-5 filter-container">
          <Col xs={12} sm={6} md={4}>
          <Form>
          <Form.Label className="mt-2 font-weight-bold">Filter memes by category: </Form.Label>
            <div className="mb-3" onChange={(e) => {onCategoryChange(e.target.value)}}>
              <Form.Check inline label="Nature" type={'checkbox'} value={"Nature"}/>
              <Form.Check inline label="Travel" type={'checkbox'} value={"Travel"}/>
              <Form.Check inline label="Animals" type={'checkbox'} value={"Animals"}/>
            </div>
            <div className="mb-3" onChange={(e) => {onCategoryChange(e.target.value)}}>
              <Form.Check inline label="Sports" type={'checkbox'} value={"Sports"}/>
              <Form.Check inline label="Urban" type={'checkbox'}  value={"Urban"}/>
              <Form.Check inline label="Work" type={'checkbox'} value={"Work"}/>
            </div>
            <div className="mb-2">
              <Form.Check inline label="Other" type={'checkbox'} id={`inline-checkbox-animals`} value={ownCategoryChecked} onChange={() => {setOwnCategoryChecked(!ownCategoryChecked)}}/>
              <Form.Control
                  className={`${ownCategoryChecked ? 'd-block' : 'd-none'}`}
                  placeholder="Look for other category"
                  type="text"
                  value={ownCategory}
                  onChange={(e) => setOwnCategory(e.target.value)}/>
            </div>
          </Form>
          </Col>
          <Col xs={12} sm={6} md={4}>
              <p className="mt-2 font-weight-bold">Sort by:</p>
              <Form.Control as="select" className="sort-select" onChange={sortMemes}>
                <option>select</option>
                <option>most popular</option>
                <option>least popular</option>
                <option>title A-Z</option>
                <option>generated recently</option>
                <option>used template</option>
              </Form.Control>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <p className="mt-2 font-weight-bold">Search meme by title or caption:</p>
            <div className ="search-container">
              {/*Search Input */}
              <Row>
              <Form.Control
                  className="search-field"
                  placeholder="Search..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}/>
                  <i className="fa fa-search search-icon" aria-hidden="true"/>
              </Row>
              </div>
          </Col>
        </Row>
        <p className="mt-5"> <span className="font-weight-bold"> Download the whole meme gallery or parts of it as a .zip archive: </span><br/>
        <span className="text-muted mt-1 mb-2 download-info">(You can select the memes you want to download by filtering the gallery or select them by hand using the checkbox at the bottom of each Meme-Tile. <br/>
          In case you want to limit the downloaded memes you can always specify a maximum number.)</span></p>
        <div className="d-flex flex-row justify-content-center mt-4">
          <Button variant="dark" onClick={() => downloadMemes(false)} className="mx-5">Download shown memes!</Button>
          <Button variant="dark" onClick={() => downloadMemes(true)} className="mx-5">Download selected memes!</Button>
          <Form.Label className="font-weight-bold align-self-center mr-2">Maximum number of memes:</Form.Label>
          <InputGroup className={"short-input"} title={"Maximum number"}>
            <FormControl type="number" value={maxDownloadNumber} onChange={(e) => {setMaxDownloadNumber(Number(e.target.value))}}/>
          </InputGroup>
        </div>
        <div className="gallery mt-5" data-toggle="modal" data-target="#galleryModal" id="gallery">
          {createGallery()}
        </div>
        <Modal show={show} onHide={hideSlideshow} id="galleryModal">
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            {createCarousel()}
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <Form.Check inline label="Random meme-order" value={randomCarousel} type={'checkbox'} onChange={(e) => {
              setRamdomCarousel(!randomCarousel)
            }}/>
            <div>
              <Button variant={`${carouselAutoplay ? 'danger' : 'success'}`} onClick={() => setCarouselAutoplay(!carouselAutoplay)}>
                {`${carouselAutoplay ? 'Stop auto play' : 'Auto play'}`}
              </Button>
              <Button className="ml-2" variant="dark" onClick={hideSlideshow} >
                Close
              </Button>
            </div>
          </Modal.Footer>
      </Modal>
    </Container>
  );
};
export default MemeGallery;