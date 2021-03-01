import React, { useState, useEffect, useMemo, useCallback} from "react";
import axios from "axios";
import {Tabs, Tab, Form, FormControl, Row, Col, Button, InputGroup} from "react-bootstrap";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import Camera from 'react-html5-camera-photo';
import { BASE_API_URL } from '../../config';

const TemplateSelection = (props) => {

  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState(undefined);

  const [filteredCurrentIndex, setFilteredCurrentIndex] = useState(0);
  const [categoryFilteredSelector, setCategoryFilteredSelector] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [ownFilteredCategory, setOwnFilteredCategory] = useState("");
  const [ownFilteredCategoryChecked, setOwnFilteredCategoryChecked] = useState(false);

  //attributes for API
  const [apiImages, setAPIImages] = useState([]);
  const [currentAPIIndex, setCurrentAPIIndex] = useState(0);

  //attributes for own URL
  const [ownURL, setOwnURL] = useState("");

  const[showCamera, setShowCamera] =useState(false);

  const loadImages = async () => {

    const res = await axios.get(BASE_API_URL + "/images/");
    setImages(res.data);
  };

  const loadAPIImages = async () => {
    const res = await axios.get("https://api.imgflip.com/get_memes");
    setAPIImages(res.data);
  }

  //load images from database and from API once when page is rendered
  useMemo(() => {
    loadImages();
    loadAPIImages();
  }, []);

  // show correct image-template from database with respect to filtered categories
  const previewImage = useMemo(() => {
    if (images.length === 0) {
      return <p>It seems like there are no images in the database yet</p>;
    } else {
      if((categoryFilteredSelector.length > 0) || (ownFilteredCategoryChecked && ownFilteredCategory !== "")){
        return (filteredImages.length === 0) ? <p>No images found!</p> :
        <img
        className="preview-image"
        src={filteredImages[filteredCurrentIndex].url}
        alt="slideshow-pic"
        onClick={() => props.onSelectImage({
          url: filteredImages[filteredCurrentIndex].url
        }, "database")}
      />
      } else {
        return(
          <img
            className="preview-image"
            src={images[currentIndex].url}
            alt="slideshow-pic"
            onClick={() => props.onSelectImage({
                url: images[currentIndex].url,
              }, "database")}
          />
        );
      }
    }
    }
    , [categoryFilteredSelector.length, currentIndex, filteredCurrentIndex, filteredImages, images, ownFilteredCategory, ownFilteredCategoryChecked, props]);

    // filter-functionality for image-templates from database
    useEffect(() => {
        setFilteredImages(images.filter((image) => { 
        if(image.categories){
            const categories = image.categories; //.split(',');
            const selectors = ownFilteredCategoryChecked && ownFilteredCategory !== "" ? [...categoryFilteredSelector, ownFilteredCategory] : categoryFilteredSelector;
            return selectors.map((selector)=> selector.toLowerCase()).every((selector) => { 
                return categories.map((category) => category.toLowerCase()).includes(selector)})
        } else {
            return false
        }
        }))
    }, [categoryFilteredSelector, images, ownFilteredCategory, ownFilteredCategoryChecked])
     
    const filterCategoryChange = (category) => {
        categoryFilteredSelector.includes(category)? 
        setCategoryFilteredSelector(categoryFilteredSelector.filter((element) => element !== category)) : 
        setCategoryFilteredSelector([...categoryFilteredSelector, category])
    };

    //slide-show functionality for database-images or ImgFlip-API
    const getLastImage = (slideshow) => {
        if (slideshow === "database"){
            setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
            if(filteredImages.length!==0){
                setFilteredCurrentIndex(filteredCurrentIndex > 0 ? filteredCurrentIndex - 1 : filteredImages.length - 1);
            }
        }
        else {
            setCurrentAPIIndex(currentAPIIndex > 0 ? currentAPIIndex -1 : apiImages.data.memes.length -1);
        }
      };
    
    const getNextImage = (slideshow) => {
        if(slideshow === "database") {
            setCurrentIndex(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
            if(filteredImages.length!==0){
                setFilteredCurrentIndex(filteredCurrentIndex < filteredImages.length - 1 ? filteredCurrentIndex + 1 : 0);
            } 
        }
        else {
            setCurrentAPIIndex(currentAPIIndex < apiImages.data.memes.length -1 ? currentAPIIndex + 1 : 0);
        }
    };

  const selectAPIImage = useCallback(() => {
    props.onSelectImage({
        url: apiImages.data.memes[currentAPIIndex].url,
      }, "img-flip")
  }, [props, apiImages, currentAPIIndex]);

  //show current image of API
  let previewAPIImage = useMemo(() => {
    if (apiImages.length === 0) {
      return <p>No images to show</p>;
    } else {
        return(
          <img
            className="preview-image"
            src={apiImages.data.memes[currentAPIIndex].url}
            alt="slideshow-pic"
            onClick={selectAPIImage}
          />
        );
    }
  }, [apiImages, currentAPIIndex, selectAPIImage]);
    
  // set the uploaded image as the selected image
  const setLocalTemplate = () => {
    if (selectedFile !== undefined) {
      props.onSelectImage({
        url: URL.createObjectURL(selectedFile),
        fromLocalStorage: true
      }, "local")
    } else {
      alert("Please select an image file for your meme template first.")
    }
  }

  const uploadChangeHandler = (event) => {
    const files = event.target.files
    const file = files.length > 0 ? files[0] : undefined
    setSelectedFile(file)
  }

  const urlInput = ({target:{value}}) => {
    setOwnURL(value); 
  };

  const selectURLImage = useCallback(() => {
    if(ownURL !== undefined){
      props.onSelectImage({url: ownURL}, "custom-url");
    }
    else{
      alert("Please select an image file url for your meme template first.")
    }
  }, [props, ownURL]);

  const handleTakePhoto = (dataUri) => {
    if (dataUri !== undefined) {
      props.onSelectImage({
        url: dataUri,
        fromLocalStorage: true
      }, "camera")
    } else {
      alert("Please select an image file for your meme template first.")
    }
  }

  return (
    <Tabs defaultActiveKey="template" className="template-selection mb-3" data-test="component-template-selection">
    <Tab eventKey="template" title="Image-Templates" className="template-selection-tab">
      {/* -------------------- Template-Selection --------------------*/}
      <Row className="slideshow mt-5 ml-5">
        <Col xs={12} md={4}>
          <Row className="filtercategory">
            <Form>
                <Form.Label className="font-weight-bold">Filter memes by category: </Form.Label>
                <div className="mb-3" onChange={(e) => {filterCategoryChange(e.target.value)}}>
                    <Form.Check inline label="Nature" type={'checkbox'} value={"Nature"}/>
                    <Form.Check inline label="Travel" type={'checkbox'} value={"Travel"}/>
                    <Form.Check inline label="Animals" type={'checkbox'} value={"Animals"}/>
                </div>
                <div className="mb-3" onChange={(e) => {filterCategoryChange(e.target.value)}}>
                    <Form.Check inline label="Sports" type={'checkbox'} value={"Sports"}/>
                    <Form.Check inline label="Urban" type={'checkbox'}  value={"Urban"}/>
                    <Form.Check inline label="Work" type={'checkbox'} value={"Work"}/>
                </div>
                <div className="mb-2">
                    <Form.Check inline label="Other" type={'checkbox'} id={`inline-checkbox-animals`} value={ownFilteredCategoryChecked} onChange={() => {setOwnFilteredCategoryChecked(!ownFilteredCategoryChecked)}}/>
                    <Form.Control
                        className={`${ownFilteredCategoryChecked ? 'd-block' : 'd-none'}`}
                        placeholder="Look for other category"
                        type="text"
                        value={ownFilteredCategory}
                        onChange={(e) => setOwnFilteredCategory(e.target.value)}/>
                </div>
            </Form>
          </Row>
        </Col>
        <Col className="text-right">
          <Button variant="dark" onClick={() => getLastImage('database')}>
            <FaArrowLeft/>
          </Button>
        </Col>
        <Col className="text-center">
          {previewImage}
        </Col>
        <Col>
          <Button variant="dark" onClick={() => getNextImage('database')}>
            <FaArrowRight/>
          </Button>
        </Col>
      </Row>
    </Tab>
    <Tab eventKey="imgflip" title="ImgFlip-API" className="template-selection-tab">
      <Row className="slideshow mt-5 ml-5">
        <Col className="text-right">
          <Button variant="dark" onClick={() => getLastImage('api')}>
            <FaArrowLeft/>
          </Button>
        </Col>
        <Col className="text-center">{previewAPIImage}</Col>
        <Col>
          <Button variant="dark" onClick={() => getNextImage('api')}>
            <FaArrowRight/>
          </Button>
        </Col>
      </Row>
    </Tab>
    <Tab eventKey="customApi" title="Custom URL upload" className="template-selection-tab">
      <div className="mt-3">
        <p>Choose a url-file to upload it as a new meme template.</p>
        <InputGroup className="mb-3 input-URL">
          <FormControl onChange={urlInput} value={ownURL} id="basic-url" aria-describedby="basic-addon3" />
          <Button className="mr-1 submit" variant="dark" type="submit" onClick={selectURLImage}>Submit</Button>
        </InputGroup>    
      </div>
    </Tab>
    <Tab eventKey="upload" title="Upload own image" className="template-selection-tab">
      <div className="mt-3">
        <p>Choose a file to upload it as a new meme template.</p>
        <input type="file" accept="image/*" onChange={uploadChangeHandler}/>
        <Button variant="dark" onClick={setLocalTemplate}>Submit</Button>
      </div>
    </Tab>
    <Tab eventKey="photo" title="Take photo with camera" className="template-selection-tab">
      <div className="mt-3">
        <p>Take a photo with your camera</p>
        <Button variant="dark" onClick={() => setShowCamera(true)}>Show camera</Button>
        <div className={`${showCamera ? 'd-block' : 'd-none'}`}>
          {showCamera && (
            <div position="center" onClose={() => setShowCamera(false)}>
              <Camera
                onTakePhotoAnimationDone = { (dataUri) => { handleTakePhoto(dataUri); setShowCamera(false); } }
              />
              </div>
          )}
        </div>
      </div>
    </Tab>
  </Tabs>
  );
};

export default TemplateSelection;
