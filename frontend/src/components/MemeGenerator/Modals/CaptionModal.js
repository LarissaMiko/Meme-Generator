import React from "react";
import {SketchPicker} from "react-color";
import {Modal, FormControl, Button, Dropdown, DropdownButton, InputGroup, ToggleButton, ToggleButtonGroup} from "react-bootstrap";

const CaptionModal = (props) => {

  return (
    <Modal show={props.show} onHide={props.onSetShowFalse}>
        <Modal.Header closeButton>
        <Modal.Title>Font Options - {props.captionName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pl-4">
             <div className="mb-2">
                <label>Font: </label>
                <DropdownButton 
                className="dropdown-button" 
                variant="secondary"
                title={`${props.captionSettings.font}`}
                onSelect={(e) => props.onCaptionSettings({...props.captionSettings, font: e})}>
                <Dropdown.Item eventKey="Arial">Arial</Dropdown.Item>
                <Dropdown.Item eventKey="Times New Roman">Times New Roman</Dropdown.Item>
                <Dropdown.Item eventKey="Times">Times</Dropdown.Item>
                <Dropdown.Item eventKey="Georgia">Georgia</Dropdown.Item>
                <Dropdown.Item eventKey="Verdana">Verdana</Dropdown.Item>
                <Dropdown.Item eventKey="Helvetica">Helvetica</Dropdown.Item>
                <Dropdown.Item eventKey="Fantasy">Fantasy</Dropdown.Item>
                <Dropdown.Item eventKey="Lato">Lato</Dropdown.Item>
                </DropdownButton>
            </div>
            <div className="mb-2">
                <label for="fontsize-label">Fontsize:</label>
                <InputGroup className="fontsize-input">
                    <FormControl
                    type="number"
                    onChange={({target: {value}}) => props.onCaptionSettings({...props.captionSettings, fontSize: value})}
                    value={props.captionSettings.fontSize}
                    aria-label="fontsize"
                    aria-describedby="basic-addon1"/>
                </InputGroup>
                px
            </div>
            <div className="mb-2">
                <label>Color:</label>
                <DropdownButton 
                className="dropdown-button" 
                title="Choose Color"
                variant="secondary">Secondary
                    <Dropdown.Item eventKey="Arial">
                    <SketchPicker 
                    className="sketchpicker"
                    color={props.captionSettings.fontColor}
                    onChangeComplete={(color) => props.onCaptionSettings({...props.captionSettings, fontColor: color.hex})}/>
                    </Dropdown.Item>
                </DropdownButton>{' '}
            </div>
            <div className="mb-2">
                <ToggleButtonGroup type="checkbox" defaultValue={[1, 2, 3]} className="mb-2">
                    <ToggleButton 
                    onChange={() => props.onCaptionSettings({...props.captionSettings, fontWeight: props.captionSettings.fontWeight === "normal" ? 'bold' : 'normal'})}
                    variant="secondary" 
                    value={1}>Bold</ToggleButton>
                    <ToggleButton 
                    onChange={() => props.onCaptionSettings({...props.captionSettings, fontStyle: props.captionSettings.fontStyle === "normal" ? 'italic' : 'normal'})}
                    variant="secondary" 
                    value={2}>Italic</ToggleButton>
                    <ToggleButton 
                    onChange={() => props.onCaptionSettings({...props.captionSettings, fontUppercase: !props.captionSettings.fontUppercase})}
                    variant="secondary"
                    value={3}>USE ALL CAPS </ToggleButton>
                </ToggleButtonGroup>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => props.onSetShowFalse()}>Close</Button>
            <Button variant="primary" onClick={() => props.onSetShowFalse()}>Okay</Button>
        </Modal.Footer>
    </Modal>
    
  );
};

export default CaptionModal;