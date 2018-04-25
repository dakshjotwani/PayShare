import React from 'react';
import Cropper from 'react-cropper';
import generateItemList from './fe-receipt-parse.js';
import 'cropperjs/dist/cropper.css';
import {Image} from 'image-js';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup, Input, FormText
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
        let canvas = this.cropperRef.current.getCroppedCanvas();
        this.setState({
            fileSelect: false,
            imagePreviewUrl: false,
        });

        Image.load(canvas.toDataURL()).then ((image) => {
            let grey = image.grey();
            let mask = grey.mask({
                threshold: grey.getThreshold({
                    algorithm: 'intermodes'
                })
            });
            this.setState({
                editImagePreview: mask.toDataURL()
            });

            let maskPromise = mask.toBlob('image/png', 1);
            let expRef = this.props.expenseReference
            maskPromise.then((blob) => {
                generateItemList(blob, (list) => {
                    expRef.collection('items').get()
                        .then(snapshot =>  {
                            snapshot.forEach(function (doc) {
                                expRef.collection('items').doc(doc.id).delete();
                            });
                            for (let i = 0; i < list.length; i++) {
                                expRef.collection('items').add({
                                    index: i,
                                    name: list[i][0],
                                    price: list[i][1],
                                    users: {}
                                })
                            }
                            console.log("Loading Items")
                        });

                });
            });
        });
    }

    render() {
        // Maybe change button to look like camera
        let { fileSelect } = this.state;
        let { imagePreviewUrl } = this.state;
        let { editImagePreview } = this.state;
        //let {editImageUrl} = this.state;
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
                        style={{ height: 400, width: '100%' }} />
                </div>
            );
            primaryButton = <Button color="primary" onClick={this._crop.bind(this)}>Next</Button>;
        } else {
            imagePreview = null;
        }

        if (editImagePreview) {
            thresholdPreview = (
                <div>
                    <FormText color="muted">
                        If the items are legible, click Finish. Otherwise, try with another picture.
                    </FormText>
                    <img src={editImagePreview} width="100em" height="100%" />
                </div>
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
                <Button color="success" onClick={this.toggle}>
                    <i className="fas fa-file-alt"></i>
                </Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add Receipt</ModalHeader>
                    <ModalBody>
                        {selectFile}
                        {imagePreview}
                        {thresholdPreview}
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
