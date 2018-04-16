import React from 'react';
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
    }

    toggle() {
        // If it was just opened
        if (this.state.modal === false) {
            this.setState({
                initalState: this.state,
                modal: true,
            });
        } else {
            // If closing without changes
            this.setState(this.state.initalState);
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
              imagePreviewUrl: reader.result
            });
        };

        reader.readAsDataURL(file);
    }

    _crop() {
        let canvas = this.refs.cropper.getCroppedCanvas();
        let context = canvas.getContext('2d');
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
        generateItemList(canvas, (list) => {
            console.log(list);    
        });
    }

    render() {
        // Maybe change button to look like camera
        let {imagePreviewUrl} = this.state;
        let imagePreview;
        if (imagePreviewUrl) {
            imagePreview = (
                <div>
                    <Cropper
                        ref='cropper'
                        src={imagePreviewUrl}
                        style={{height: 400, width: '100%'}}
                        /* crop={this._crop.bind(this)} */ />
                    <Button color="primary" onClick={this._crop.bind(this)}>Select Items</Button>
                </div>
            );
        }
        return (
            <div>
            <Button color="danger" onClick={this.toggle}>
                <i class="fas fa-camera"></i>
            </Button>
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
              <ModalHeader toggle={this.toggle}>Add Receipt</ModalHeader>
              <ModalBody>
                        <FormGroup>
                            <Input onChange={this.handleImage} type="file" name="recImg" id="recImg" />
                            <FormText color="muted">
                                Upload your receipt!
                            </FormText>
                        </FormGroup>
                        {imagePreview}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.toggle}>Save</Button>{' '}
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
              </ModalFooter>
            </Modal>
          </div>
        );
    }
}

export default ReceiptSelect;
