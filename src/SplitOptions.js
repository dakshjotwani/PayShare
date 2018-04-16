import React from 'react'
import './Expenses.css'
import ByItemOpt from './ByItemOpt'
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Label, Input, FormGroup,
    Container, Row, Col,
    ListGroup, ListGroupItem
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
                <Col className="centerVertical">
                    {user}
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
            this.state[i] = "success";
        }
    }

    componentDidMount() {
        for (var i = 0; i < this.props.users.length; i++) {
            var key = this.props.users[i] + i;
            this.setState({[key]: "success"})
        }
    }

    handleSubmit = () => {
        let isSelected;
        for (var i = 0; i < this.props.users.length; i++) {
            let value = this.state[this.props.users[i] + i];
            if (value === 'success') {
                isSelected = true;
            } else {
                isSelected = false;
            }
            console.log(this.props.users[i] + ": " + isSelected);
        }
        this.props.toggle();
    }
    
    handleChange  = (event) => {
        const name = event.currentTarget.getAttribute("name");
        let newVal;
        if (this.state[name] === undefined || this.state[name] === "success") {
            newVal = "notselected";
        } else {
            newVal = "success"
        }
        this.setState({
            [name]: newVal,
        });
    }

    render() {
        let numSelected = 0;
        for (var i = 0; i < this.props.users.length; i++) {
            var key = this.props.users[i] + i;
            if (this.state[key] === "success" || this.state[key] === undefined) {
                numSelected += 1;
            }
        }
        let UserList = this.props.users.map((user, index) => {
            if (this.state[user + index] === "success" || this.state[user + index] === undefined) {
                return (
                    <ListGroupItem color="success" key={index} name={user + index} onClick={this.handleChange} action>
                        <div className="row justify-content-between">
                            <div className="col-4">
                                {user}
                            </div>
                            <div className="col-4">
                                {(parseFloat(this.props.totalAmount) / numSelected).toFixed(2)}
                            </div>
                        </div>
                    </ListGroupItem>
                );
            } else {
                return (
                    <ListGroupItem color={this.state[user + index]} key={index} name={user + index} onClick={this.handleChange} action>
                        <div className="row justify-content-between">
                            <div className="col-4">
                                {user}
                            </div>
                            <div className="col-4">
                                {(0).toFixed(2)}
                            </div>
                        </div>
                    </ListGroupItem>
                );
            }
        });
        return (
            <div>
                <Button outline onClick={this.props.toggle} color="primary">Equally</Button>
                <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.props.toggle}>Split Equally</ModalHeader>
                    <ModalBody>
                        <FormGroup check>
                            {UserList}
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
            byItemModal: false,
            users: this.props.users,
            totalAmount: this.props.totalAmount
        }
        this.toggleEqualModal = this.toggleEqualModal.bind(this);
        this.toggleUnequalModal = this.toggleUnequalModal.bind(this);
        this.toggleByItemModal = this.toggleByItemModal.bind(this);
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
    toggleByItemModal() {
        this.componentDidMount();
        // If it was just opened
        if (this.state.byItemModal === false) {
            this.setState({
                itemsave: this.state,
                byItemModal: true
            });
        } else {
            // If closing without changes
            this.setState(this.state.itemsave);
            this.setState({ byItemModal: false });
        }
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
                <Col sm={{ size: 'auto', offset: 0 }}>
                    <ByItemOpt totalAmount={this.state.totalAmount} users={this.state.users} modal={this.state.byItemModal} toggle={this.toggleByItemModal} />
                </Col>
            </Row>
        );
    }
}
export default SplitOptions;