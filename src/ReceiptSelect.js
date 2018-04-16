import React from 'react'
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

    render() {
        // Maybe change button to look like camera
        let {imagePreviewUrl} = this.state;
        let imagePreview;
        if (imagePreviewUrl) {
            imagePreview = <img src={imagePreviewUrl} alt="receipt"/>;
        }
        return (
            <div>
            <Button color="danger" onClick={this.toggle}>
                <i className="fas fa-camera"></i>
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