import React from 'react';
import ReactDOM from 'react-dom';
import Cropper from 'react-cropper';
import generateItemList from './fe-receipt-parse.js';
import 'cropperjs/dist/cropper.css';
import {
    ListGroup,
    Container,
    Row,
    Col,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form, FormGroup, Label, Input, FormText
} from 'reactstrap';

class ReceiptSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false 
        };
        this.toggle = this.toggle.bind(this);
        this.handleImage = this.handleImage.bind(this);
        this.cropperRef = React.createRef();
        this.canvasRef = React.createRef();
        this.imgRef = React.createRef();
    }

    toggle() {
        // If it was just opened
        if (this.state.modal === false) {
            this.setState({
                initalState: this.state,
                modal: true,
                fileSelect: true
            });
        } else {
            // If closing without changes
            this.setState(this.state.initalState);
            this.setState({
                editImagePreview: false
            });
        }
    }

    handleImage(event) {
        let reader = new FileReader();
        let file = event.target.files[0];
        if (!file) {
            this.setState({
              file: undefined,
              imagePreviewUrl: undefined
            });
            return;
        }
        reader.onloadend = () => {
            this.setState({
              file: file,
              imagePreviewUrl: reader.result,
            });
        };

        reader.readAsDataURL(file);
    }

    _crop() {
        let realCanvas = this.cropperRef.current.getCroppedCanvas();
        let canvas = this.cropperRef.current.getCroppedCanvas({width: 320});
        let context = canvas.getContext('2d');
        this.setState({
            fileSelect: false,
            imagePreviewUrl: false,
            editImagePreview: true,
        });
        let pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        let d = pixels.data;
        for (let i = 0; i < d.length; i+=4) {
            let r = d[i];
            let g = d[i + 1];
            let b = d[i + 2];
            var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 190) ? 255 : 0;
            pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = v;
        }
        context.putImageData(pixels, 0, 0);
        this.refs.modalbody.appendChild(canvas);

        canvas = realCanvas;
        context = canvas.getContext('2d');
        this.setState({
            fileSelect: false,
            imagePreviewUrl: false,
            editImagePreview: true,
        });
        pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        d = pixels.data;
        for (let i = 0; i < d.length; i+=4) {
            let r = d[i];
            let g = d[i + 1];
            let b = d[i + 2];
            var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 190) ? 255 : 0;
            pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = v;
        }
        context.putImageData(pixels, 0, 0);
        
        generateItemList(canvas, (list) => {
            console.log(list);    
            this.props.onSave(list);
        });
    }

    render() {
        // Maybe change button to look like camera
        let {fileSelect} = this.state;
        let {imagePreviewUrl} = this.state;
        let {editImagePreview} = this.state;
        let {editImageUrl} = this.state;
        let selectFile;
        let imagePreview;
        let primaryButton;
        let thresholdPreview;

        if (imagePreviewUrl) {
            imagePreview = (
                <div>
                    <Cropper
                        ref={this.cropperRef}
                        src={imagePreviewUrl}
                        viewMode={1}
                        style={{height: 400, width: '100%'}} />
                </div>
            );
            primaryButton = <Button color="primary" onClick={this._crop.bind(this)}>Next</Button>;
        } else {
            imagePreview = null;
        }

        if (editImagePreview) {
            thresholdPreview = (
                <FormText color="muted">
                    If the items are legible, click Finish. Otherwise, try with another picture.
                </FormText>
            );
            primaryButton = <Button color="primary" onClick={this.toggle}>Finish</Button>
        } else {
            thresholdPreview = null;
        }

        if (fileSelect) {
            selectFile = ( 
                <FormGroup>
                    <Input onChange={this.handleImage} type="file" name="recImg" id="recImg" />
                    <FormText color="muted">
                        Upload your receipt and select the items!
                    </FormText>
                </FormGroup>
            );
        } else {
            selectFile = null;
        }

        return (
            <div>
            <Button color="danger" onClick={this.toggle}>
                <i className="fas fa-camera"></i>
            </Button>
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
              <ModalHeader toggle={this.toggle}>Add Receipt</ModalHeader>
              <ModalBody>
                        {selectFile}
                        {imagePreview}
                        {thresholdPreview}
                        <div ref="modalbody"></div>
              </ModalBody>
              <ModalFooter>
                {primaryButton}
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
              </ModalFooter>
            </Modal>
          </div>
        );
    }
}

export default ReceiptSelect;
