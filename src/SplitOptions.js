import React from 'react'
import { Link } from 'react-router-dom'
import './Expenses.css';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Label, Input, FormGroup,
    Container, Row, Col
} from 'reactstrap';

class UnequalOpt extends React.Component {
    constructor(props) {
        super(props);
        var selectedUsers = [];
        for (var i = 0; i < this.props.users.length; i++) {
            selectedUsers.push(1);
        }
        this.state = {selectedUsers: selectedUsers};
    }
    
    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value
        });
    }

    handleSubmit = () => {
        for (var i = 0; i < this.props.users.length; i++) {
            console.log(this.props.users[i] + ": " + this.state[this.props.users[i] + i]);
        }
        this.props.toggle();
    }

    render() {
        const nameBoxes = this.props.users.map((user, index) =>
        <div key={index}>
        <Container>
            <Row>
                <Col>
                    <h2>{user}</h2>
                </Col>
                <Col>
                <div className="input-group" style={{padding: '0.25em'}}>
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroupPrepend2">$</span>
                    </div>
                    <input type="number"
                        name={user+index}
                        onChange={this.handleChange}
                        className="form-control" id="totalAmount" placeholder="0.00" required>
                    </input>
                </div>
                </Col>
            </Row>
        </Container>
        </div>
        );
        return (
        <div>
        <Button outline onClick={this.props.toggle} color="primary">Unequally</Button>
        <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
            <ModalHeader toggle={this.props.toggle}>Split Unequally</ModalHeader>
                    <ModalBody>
                        <FormGroup onSubmit={this.handleSubmit}>
                            {nameBoxes}
                        </FormGroup>
          </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={this.handleSubmit}>Save</Button>{' '}
                <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
        </div>
        );
    }
}

class EqualOpt extends React.Component {
    constructor(props) {
        super(props);
        var selectedUsers = [];
        this.state = {};
        for (var i = 0; i < this.props.users.length; i++) {
            var key = this.props.users[i] + i;
            this.state[key] = true;
        }
        this.state = {selectedUsers: selectedUsers};
    }

    componentDidMount() {
        for (var i = 0; i < this.props.users.length; i++) {
            var key = this.props.users[i] + i;
            this.setState({[key]: true})
        }
    }

    handleCheck = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit = () => {
        for (var i = 0; i < this.props.users.length; i++) {
            let thing = this.state[this.props.users[i] + i];
            if (thing === undefined) {
                thing = true;
            }
            console.log(this.props.users[i] + ": " + thing);
        }
        this.props.toggle();
    }
    
    
    render() {
        const nameBoxes = this.props.users.map((user, index) =>
            <div key={index}>
                <Label check>
                    <Input defaultChecked name={user+index} onChange={this.handleCheck} type="checkbox" /> {' '} {user} {' '} {this.props.totalAmount}
                </Label>
            </div>
        );
        return (
        <div>
        <Button outline onClick={this.props.toggle} color="primary">Equally</Button>
        <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
            <ModalHeader toggle={this.props.toggle}>Split Equally</ModalHeader>
                    <ModalBody>
                        <FormGroup check>
                            {nameBoxes}
                        </FormGroup>
          </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={this.handleSubmit}>Save</Button>{' '}
                <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
        </div>
        );
    }
}

class SplitOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            equalModal: false,
            unequalModal: false,
            users: this.props.users, 
            totalAmount: this.props.totalAmount
        }
        this.toggleEqualModal = this.toggleEqualModal.bind(this);
        this.toggleUnequalModal = this.toggleUnequalModal.bind(this);
    }

    componentDidMount() {
        this.setState({
            users: this.props.users, 
            totalAmount: this.props.totalAmount
        });
    }

    toggleUnequalModal() {
        this.componentDidMount();
        this.setState({
            unequalModal: !this.state.unequalModal
        });
    }
    toggleEqualModal() {
        this.componentDidMount();
        this.setState({
            equalModal: !this.state.equalModal
        });
    }

    render() {
        return (
            <Row>
                <Col sm={{ size: 'auto', offset: 1 }}>
                    <EqualOpt totalAmount={this.state.totalAmount} users={this.state.users} modal={this.state.equalModal} toggle={this.toggleEqualModal} />
                </Col>
                <Col sm={{ size: 'auto', offset: 0 }}>
                    <UnequalOpt totalAmount={this.state.totalAmount} users={this.state.users} modal={this.state.unequalModal} toggle={this.toggleUnequalModal} />
                </Col>
            </Row>
        );
    }
}
export default SplitOptions;