import React, {useCallback, useEffect, useMemo, useState, useRef} from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { useAuth } from "../../context/auth";
// create uid for memes
import uuid from 'react-native-uuid'
import {
  Button,
  ButtonToolbar,
  Col,
  DropdownButton,
  Form,
  FormControl,
  InputGroup,
  Row,
  ToggleButton,
  ToggleButtonGroup
} from "react-bootstrap";
import CaptionModal from './Modals/CaptionModal';
import ShareModal from './Modals/ShareModal';
import TemplateSelection from './TemplateSelection';
import "./MemeGenerator.css";
import Draggable from 'react-draggable';
import {SketchPicker} from "react-color";
import { BASE_API_URL, FRONTEND_URL } from "../../config";

import 'react-html5-camera-photo/build/css/index.css';

import {getImage, drawText, drawLine, getBlob} from '../../utils/CanvasUtils';

const MemeGenerator = () => {
  //state attributes
  
  const [selectedImages, setSelectedImages] = useState([]);

  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  const [showBottom, setShowBottom] = useState(false);
  const [showOther, setShowOther] = useState(false);
  const [addCaption, addAnotherCaption] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  const [memeCategories, setMemeCategories] = useState([])
  const [ownCategory, setOwnCategory] = useState("")
  const [ownCategoryChecked, setOwnCategoryChecked] = useState(false)
  const [privateMeme, setPrivateMeme] = useState(false)
  // caption-settings
  const captionSettings = {
    caption: '',
    font: 'Arial',
    fontSize: '25',
    fontColor: '#fff',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontUppercase: false
  }
  const [topCaptionSettings, setTopCaptionSettings] = useState(captionSettings);
  const [bottomCaptionSettings, setBottomCaptionSettings] = useState(captionSettings);
  const [anotherCaptionSettings, setAnotherCaptionSettings] = useState(captionSettings);
  // states used for drawing the canvas
  const [topCaptionSize, setTopCaptionSize] = useState([0, 0])
  const [botCaptionSize, setBotCaptionSize] = useState([0, 0])
  const [anotherCaptionSize, setAnotherCaptionSize] = useState([0, 0])

  const [memeWidth, setMemeWidth] = useState(640);
  const [memeHeight, setMemeHeight] = useState(480);
  const [autoAdjustSize, setAutoAdjustSize] = useState(true)
  const [autoAdjusted, setAutoAdjusted] = useState(false)
  const [fileSize, setFileSize] = useState(-1);

  const [currentSrc, setCurrentSrc] = useState("");
  const [paintingEnabled, setPaintingEnabled] = useState(false)
  const [painting, setPainting] = useState(false)
  const [paintingPos, setPaintingPos] = useState([[-1, -1]])
  const [paintColor, setPaintColor] = useState('#000')
  const [paintSize, setPaintSize] = useState(3)

  const [speechCaption, setSpeechCaption] = useState(null)
  
  const captionRef = useRef(null)
  const captionBottomRef = useRef(null)
  const captionAnotherRef = useRef(null)
  const canvasRef = useRef(null)
  const sliderRef = useRef(null)
  const addImageRef = useRef(null)
  const recognitionButtonRef = useRef(null)

  //authentication
  const { authTokens, userName, userid } = useAuth();

  const memeid = uuid.v1();

  //additional input
  const handleAddClick = () => {
    addAnotherCaption(true);
    setVisible(false);
  };

  //speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const mic = new SpeechRecognition()
  mic.interimResults = true
  mic.lang = 'en-US'
  mic.onresult = event => {
    const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')
    console.log(transcript)
    setSpeechCaption(transcript)
  }
  mic.onerror = event => {console.log(event.error)}
  mic.onend = () => {stopRecording(recognitionButtonRef.current)}

  const startRecording = (button) => {
    console.log("listen")
    button.innerHTML = "Stop Recording"
    button.className = "mb-2 mr-2 btn btn-danger"
    mic.start()
  }

  const stopRecording = (button) => {
    console.log("stop listening")
    button.innerHTML = "Start Recording"
    button.className = "mb-2 mr-2 btn btn-secondary"
    mic.stop()
  }

  const handleListen = () => {
    const button = recognitionButtonRef.current
    if (button instanceof HTMLButtonElement) {
      const isListening = button.innerHTML === "Start Recording"
      if (isListening) {
        startRecording(button)
      } else {
        stopRecording(button)
      }
    }
  }

  const selectImage = useCallback((img) => {
    if (addImageRef.current.checked) {
      console.log("adding")
      setSelectedImages([...selectedImages, img])
    } else {
      console.log(`setting image: ${img}`)
      setSelectedImages([img])
      setMemeHeight(480)
      setMemeWidth(640)
    }
    setAutoAdjusted(false)
  }, [selectedImages]);

  // function to draw the meme
  const drawCanvas = useCallback(  () => {
    const asyncDraw = async () => {
      const canvas = canvasRef.current
      if (canvas instanceof HTMLCanvasElement && memeWidth > 0 && memeHeight > 0) {
        const ctx = canvas.getContext('2d')
        if (!painting) { // only draw the complete canvas when currently not painting due to performance reasons
          // create list with all images to be drawn
          const images = []
          for (const image of selectedImages) {
            images.push(await getImage(image.fromLocalStorage ? image.url : BASE_API_URL + "/proxy/?url=" + escape(image.url)))
          }
          // once all images have returned clear the canvas and draw them
          ctx.clearRect(0, 0, memeWidth, memeHeight)
          ctx.strokeRect(0, 0, memeWidth, memeHeight)
          let scale, currentWidth, currentHeight, height = 0, width = 0
          for (const img of images) {
            if (img instanceof HTMLImageElement) {
              scale = Math.min(memeWidth / img.width, memeHeight / img.height)
              currentWidth = img.width * scale
              currentHeight = img.height * scale
              ctx.drawImage(img, 0, height, currentWidth, currentHeight)
              height += currentHeight
              if (currentWidth > width) width = currentWidth
            }
          }
          // draw the captions
          let pos = window.getComputedStyle(captionRef.current).transform.match(/[+-]?\d+(?:\.\d+)?/g).map(parseFloat)
          setTopCaptionSize(drawText(ctx, pos[4], pos[5], topCaptionSettings))
          pos = window.getComputedStyle(captionBottomRef.current).transform.match(/[+-]?\d+(?:\.\d+)?/g).map(parseFloat)
          setBotCaptionSize(drawText(ctx, pos[4], pos[5], bottomCaptionSettings))
          if (addCaption) {
            pos = window.getComputedStyle(captionAnotherRef.current).transform.match(/[+-]?\d+(?:\.\d+)?/g).map(parseFloat)
            setAnotherCaptionSize(drawText(ctx, pos[4], pos[5], anotherCaptionSettings))
          }
          // if not currently painting, but there are lines drawn previously show them
          if (paintingPos.length > 1) {
            drawLine(ctx, paintingPos, paintColor, paintSize)
          }
          // set the max value of the slider to the maximal possible filesize of the canvas
          const blob = await getBlob(canvas, 1.0)
          const size = Math.floor(blob.size / 1024 * 1.1)
          const slider = sliderRef.current
          if (slider instanceof HTMLInputElement) {
            if (slider.max < 0) {
              slider.max = `${size}`
              slider.value = `${size}`
              setFileSize(size)
            } else {
              slider.max = `${size}`
            }
          }
          if (autoAdjustSize && !autoAdjusted) {
            setMemeHeight(height)
            setMemeWidth(width)
            setAutoAdjusted(true)
          }
        } else if (paintingPos.length > 1) { // if currently painting draw only the line without redrawing the rest of the canvas for better performance
          drawLine(ctx, paintingPos, paintColor, paintSize)
        }
      }
    }
    asyncDraw().then()
  }, [selectedImages, painting, paintingPos, paintColor, paintSize, addCaption, memeWidth, memeHeight,
    autoAdjustSize, autoAdjusted, topCaptionSettings, bottomCaptionSettings, anotherCaptionSettings])

  useEffect(drawCanvas, [drawCanvas])

  // mouse event handler for the canvas element
  const canvasMouseEventHandler = useCallback((e) => {
    if (paintingEnabled) { // only listen for events when painting is enabled
      const canvas = canvasRef.current
      if (canvas instanceof HTMLCanvasElement) {
        const canvasRect = canvas.getBoundingClientRect()
        switch (e.type) {
          case "mousedown": // begin painting
            setPainting(true)
            setPaintingPos([...paintingPos, [e.clientX - canvasRect.left, e.clientY - canvasRect.top]])
            break
          case "mousemove":
            if (painting) { // if mousebutton is pressed (-> painting) add positions of the mouse to the list of points to paint
              setPaintingPos([...paintingPos, [e.clientX - canvasRect.left, e.clientY - canvasRect.top]])
            }
            break
          case "mouseup":
            setPainting(false) // stop painting and add invalid painting position (-1, -1) as a stop symbol
            setPaintingPos([...paintingPos, [-1, -1]])
            break
          case "mouseleave":
            if (painting) { // if mousebutton is pressed stop painting and add invalid painting position (-1, -1) as a stop symbol
              setPainting(false)
              setPaintingPos([...paintingPos, [-1, -1]])
            }
            break
          default:
            break
        }
      }
    }
  }, [painting, paintingPos, paintingEnabled])

  let showSelectedImage = useMemo(() => {
    if(selectedImages.length === 0){
      return <p>No image selected yet</p>      
    } else {
      return (
        <div>
          <ButtonToolbar className="mb-2">
            <ToggleButtonGroup type="checkbox" className="mr-1">
              <ToggleButton value={""} selected={paintingEnabled} onChange={() => setPaintingEnabled(!paintingEnabled)} variant={"secondary"} >Start Painting</ToggleButton>
            </ToggleButtonGroup>
              <Button className="mr-1" variant={"secondary"} onClick={() => setPaintingPos([[-1, -1]])}>Clear</Button>
              <DropdownButton className="mr-1" title={"Color"} variant={"secondary"}>
                  <SketchPicker className="sketchpicker" color={paintColor} onChangeComplete={(color) => {setPaintColor(color.hex)}}/>
              </DropdownButton>
              <InputGroup className="paint-size-input" title={"Size"}>
                <FormControl type="number" value={paintSize} onChange={(e) => {setPaintSize(Number(e.target.value))}}/>
              </InputGroup>
            </ButtonToolbar>
          <div style={{position: "relative", width: memeWidth, height: memeHeight}}>
            <canvas ref={canvasRef} width={memeWidth} height={memeHeight} onMouseDown={canvasMouseEventHandler}
                    onMouseMove={canvasMouseEventHandler} onMouseUp={canvasMouseEventHandler} onMouseLeave={canvasMouseEventHandler}/>
            <Draggable bounds="parent" nodeRef={captionRef} onDrag={drawCanvas}
                       defaultPosition={{x: memeWidth / 2, y: memeHeight * 0.1}}>
              <div ref={captionRef} style={{
                border: "solid darkgray", position: "absolute", left: -topCaptionSize[0] / 2, top: "0%",
                width: `${topCaptionSize[0] + 10}px`, height: `${topCaptionSize[1] + 10}px`
              }}>
              </div>
            </Draggable>
            <Draggable bounds="parent" nodeRef={captionBottomRef} onDrag={drawCanvas}
                       defaultPosition={{x: memeWidth / 2, y: memeHeight * 0.2}}>
              <div ref={captionBottomRef} style={{
                border: "solid darkgray", position: "absolute", left: -botCaptionSize[0] / 2, top: "0%",
                width: `${botCaptionSize[0] + 10}px`, height: `${botCaptionSize[1] + 10}px`
              }}>
              </div>
            </Draggable>
            <Draggable bounds="parent" nodeRef={captionAnotherRef} onDrag={drawCanvas}
                       defaultPosition={{x: memeWidth / 2, y: memeHeight * 0.3}}>
              <div className={addCaption ? "": "hidden"} ref={captionAnotherRef} style={{ border: "solid darkgray", position: "absolute", left: -anotherCaptionSize[0] / 2, top: "0%",
                width: `${anotherCaptionSize[0] + 10}px`, height: `${anotherCaptionSize[1] + 10}px`
              }}>
              </div>
            </Draggable> 
          </div>
        </div>
      )
    }
  }, [selectedImages, memeHeight, memeWidth, topCaptionSize, botCaptionSize, anotherCaptionSize, drawCanvas,
    paintingEnabled, canvasMouseEventHandler, paintColor, paintSize, addCaption]);

  // Save meme and all relevant information in database
  const uploadMeme = () => {
    const canvas = canvasRef.current
    const dataUrl = canvas.toDataURL()
    const categories = ownCategoryChecked ? [...memeCategories, ownCategory] : memeCategories
    
    const data = new FormData();
    data.append("memeid" , memeid)
    data.append("imgBase64", dataUrl);
    data.append("originalImage", selectedImages[0].url);
    data.append("title", title);
    data.append("topCaption", topCaptionSettings.caption);
    data.append("bottomCaption", bottomCaptionSettings.caption)
    data.append("upvotes", 0);
    data.append("downvotes", 0);
    data.append("views", 0);
    data.append("categories", categories);
    data.append("created", new Date().toISOString());
    data.append("private", privateMeme);
    if(authTokens){
      data.append("user", userid)
    }
    
    axios({
      method: "post",
      url: BASE_API_URL + "/memes/",
      data: data,
      headers: {"Content-Type": "multipart/form-data" }
      })
      .then(function (response) {
          //handle success
          setShowShareModal(true);
      })
      .catch(function (error) {
          //handle error
          console.log(error);
      });

    const statisticData = new FormData();
    statisticData.append("interaction" , "generate");
    statisticData.append("src", currentSrc);
    if(currentSrc === "database" || currentSrc === "img-flip"){
      statisticData.append("url", selectedImages[0].url)
    }

    axios({
      method: "post",
      url: BASE_API_URL + "/statistics",
      data: statisticData,
      headers: {"Content-Type": "multipart/form-data" }
      })
      .catch((err) => console.log(err))
  };

  // Download the current meme
  const downloadMeme = async () => {
    const canvas = canvasRef.current
    if (canvas instanceof HTMLCanvasElement) {
      // loop to find the maximal possible compression quality for the image in order to respect the maximal filesize set by the user
      for (let quality = 1.0; quality > 0; quality-=0.01) {
        const blob = await getBlob(canvas, quality)
        if (blob.size / 1024 < fileSize) {
          const link = document.createElement('a')
          link.download = 'meme.jpg'
          link.href = URL.createObjectURL(blob)
          link.click()
          setShowShareModal(true);
          break
        }
      }
    } else {
      alert("Please select an image for your meme first.")
    }
  };

  const onCategoryChange = (category) => {
   console.log(category)
   memeCategories.includes(category)? setMemeCategories(memeCategories.filter((element) => element !== category)) : 
   setMemeCategories([...memeCategories, category])
  }

  const handleSelectImage = async (img, src) => {
    const data = new FormData();
    data.append("interaction" , "select");
    data.append("src", src);
    if(src === "database" || src === "img-flip"){
      data.append("url", img.url)
    }

    await axios({
      method: "post",
      url: BASE_API_URL + "/statistics",
      data: data,
      headers: {"Content-Type": "multipart/form-data" }
      })

      setCurrentSrc(src);
      selectImage(img);
  }

  return (
    <div className="mt-5">
      <TemplateSelection onSelectImage={handleSelectImage}/>
      <Row className="mt-5">
        <Col xs={12} lg={8}>
        {/* -------------------- Meme-Preview --------------------*/}
          <div className="meme-container mt-5 d-flex justify-content-center align-items-top" id="meme-container">
            {showSelectedImage}
          </div>
        </Col>
        <Col xs={12} lg={4} className="generator">
      {/* -------------------- Caption Inputs --------------------*/}
          <Form className="mt-5">
            <Form.Label className="font-weight-bold">Meme Size:</Form.Label>
            <InputGroup className={"mb-3"} title={"Meme Size"}>
              <FormControl type="number" value={Math.ceil(memeWidth)} onChange={(e) => {setAutoAdjustSize(false); setAutoAdjusted(false); setMemeWidth(Number(e.target.value))}}/>
              <FormControl type="number" value={Math.ceil(memeHeight)} onChange={(e) => {setAutoAdjustSize(false); setAutoAdjusted(false); setMemeHeight(Number(e.target.value))}}/>
            </InputGroup>
            <div className={"mb-3"}>
              <Form.Check inline label="Automatically adjust meme size" type={'checkbox'} checked={autoAdjustSize} onChange={() => setAutoAdjustSize(!autoAdjustSize)}/>
            </div>
            <br/>
            <Button ref={recognitionButtonRef} className="mb-2 mr-2" variant={"secondary"} onClick={(e) => {handleListen()}}>Start Recording</Button>
            <Button className="mb-2" variant="secondary" onClick={() => setSpeechCaption('')}>x</Button>
            <br/>
            <p>{speechCaption}</p>
            <Button className="mb-2" variant="secondary" onClick={() => setTopCaptionSettings({...topCaptionSettings, 'caption': speechCaption})} disabled={!speechCaption}>Use this as top caption</Button>
            <Button className="mb-2" variant="secondary" onClick={() => setBottomCaptionSettings({...bottomCaptionSettings, 'caption': speechCaption})} disabled={!speechCaption}>Use this as bottom caption</Button>
            <Button className={addCaption ? "mb-2": "hidden mb-2"} variant="secondary" onClick={() => setAnotherCaptionSettings({...anotherCaptionSettings, 'caption': speechCaption})} disabled={!speechCaption}>Use this as additional caption</Button>
            <br/>
            <Form.Label className="font-weight-bold">Meme Title:</Form.Label>
            <Form.Control
                    className="caption-textfield"
                    placeholder="Meme-Title"
                    type="text"
                    onChange={(e) => {setTitle(e.target.value)}}/>
            <Form.Label className="mt-2 font-weight-bold">Top Caption: </Form.Label>
              <div className="d-inline-flex">
                <Form.Control
                    className="caption-textfield"
                    placeholder="Top Caption"
                    type="text"
                    value={topCaptionSettings.caption}
                    onChange={(e) => setTopCaptionSettings({...topCaptionSettings, 'caption': e.target.value})}/>
                <Button className="font-button" variant="secondary" onClick={() => setShow(true)}>
                  <i className="fa fa-cog fa-2x" aria-hidden="true"/>
                </Button>
                <CaptionModal show={show} onSetShowFalse={() => setShow(false)} captionName="Top Caption"
                              captionSettings={topCaptionSettings}
                              onCaptionSettings={(value) => setTopCaptionSettings(value)}/>
              </div>
              <br/>
              <Form.Label className="mt-2 font-weight-bold">Bottom Caption: </Form.Label>
              <br/>
              <div className="d-inline-flex">
                <Form.Control
                  className="caption-textfield"
                  placeholder="Bottom Caption"
                  type="text"
                  value={bottomCaptionSettings.caption}
                  onChange={(e) => setBottomCaptionSettings({...bottomCaptionSettings, 'caption': e.target.value})}/>
                <Button className="font-button" variant="secondary" onClick={() => setShowBottom(true)}>
                  <i className="fa fa-cog fa-2x" aria-hidden="true"/>
                </Button>
                <CaptionModal
                  show={showBottom}
                  onSetShowFalse={() => setShowBottom(false)}
                  captionName="Bottom Caption"
                  captionSettings={bottomCaptionSettings}
                  onCaptionSettings={(value) => setBottomCaptionSettings(value)}
                />
              </div>
              {visible?
              <Button id="additionalButton" variant="secondary" onClick={handleAddClick}>+</Button>
              :
              <div/>
              }
                {addCaption ?
                <div>
                  <Form.Label className="mt-2 font-weight-bold">Another Caption: </Form.Label>
                  <br/>
                  <div className="d-inline-flex">
                    <Form.Control
                      className="caption-textfield"
                      placeholder="Another Caption"
                      type="text"
                      value={anotherCaptionSettings.caption}
                      onChange={(e) => setAnotherCaptionSettings({...anotherCaptionSettings, 'caption': e.target.value})}/>
                    <Button className="font-button" variant="secondary" onClick={() => setShowOther(true)}>
                      <i className="fa fa-cog fa-2x" aria-hidden="true"/>
                    </Button>
                    <CaptionModal 
                    show={showOther} 
                    onSetShowFalse={() => setShowOther(false)}
                    captionName="Other Caption"
                    captionSettings={anotherCaptionSettings}
                    onCaptionSettings={(value) => setAnotherCaptionSettings(value)}
                    />
                  </div>
                </div>
                    : <Row/> }
              <br/>
            <Form.Label className="font-weight-bold">Multiple Images:</Form.Label>
            <div className={"mb-3"}>
              <Form.Check ref={addImageRef} inline label="Add as additional image" type={'checkbox'} disabled={!selectedImages.length}/>
            </div>
              <Form.Label className="mt-2 font-weight-bold">Categories: </Form.Label>
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
              <div>
                <Form.Check inline label="Own category" type={'checkbox'} value={ownCategoryChecked} onChange={() => {setOwnCategoryChecked(!ownCategoryChecked)}}/>
                <Form.Control
                    className={`${ownCategoryChecked ? 'd-block' : 'd-none'}`}
                    placeholder="New Category"
                    type="text"
                    value={ownCategory}
                    onChange={(e)=> setOwnCategory(e.target.value)}/>
              </div>
          </Form>
          {/* -------------------- Download/ Upload / Share Meme --------------------*/}
          <div className="mt-5 mb-5">
            <p className="font-weight-bold">Happy with the result?</p>
            <div className="mb-3">
                {!authTokens ? 
                  <Link className="btn btn-info btn-sm" to="/login">Log In to save meme privately</Link> :
                  <Form.Check inline label={`Pssst, ${userName}, want to save this meme privately?`} type={'checkbox'} id={`inline-checkbox-private`} value={privateMeme} onChange={() => {setPrivateMeme(!privateMeme)}}/> }
              </div>
            <Button variant="dark" onClick={uploadMeme} className="mb-3 mr-3">Upload meme to gallery!</Button>
            <Button variant="dark" onClick={downloadMeme} className="mb-3">Download meme!</Button>
            <ShareModal show={showShareModal} onSetShowFalse={() => setShowShareModal(false)} url={`${FRONTEND_URL}/memes/${memeid}`}/>
            <div>
              <input ref={sliderRef} type="range" min="1" max="-1" onInput={(e) => {setFileSize(e.target.value)}}/>
              <p>Filesize: {fileSize} KB</p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MemeGenerator;