import React from 'react'
import { Link } from 'react-router-dom'
import './Expenses.css';
import {
    ListGroup,
    Container,
    Row,
    Col,
    Jumbotron,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form, FormGroup, Label, Input, FormText
} from 'reactstrap';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// The Header creates links that can be used to navigate
// between routes.
class Expenses extends React.Component {
    render() {
        return (
            <div>
                <div style={{paddingTop:'1em'}}></div>
                <ListGroup>
                    <ExpenseCard />
                    <ExpenseCard />
                    <ExpenseCard />
                </ListGroup>
            </div>
        );
    }
}

class NameElem extends React.Component {
    render() {
        return (
            <Label for="name" onClick={this.props.onClick} style={{padding:'0', border:'0', marginLeft:'0.5em'}}>
            <span className="badge badge-info"> 
                {this.props.name} {' '}   
                    <span aria-hidden="true">&times;</span>
            </span>
            </Label>
        );
    }
}

class EditForm extends React.Component {
    constructor(props) {
        super(props);
        var Users = ["Parth Doshi", "Max Lin"];
        this.state = {Users: Users};
        this.removeUser = this.removeUser.bind(this);
    }

    removeUser(e) {
        const users = this.state.Users.slice();
        users.splice(e, 1);
        this.setState({Users: users});
    }

    render() {
        const namelist = this.state.Users.map((User, index) => 
            <NameElem name={User} key={index} onClick={this.removeUser.bind(this, index)} />
        );
        return (
            <div>
            Members: {' '} 
            {
                namelist                
            }
            <hr/>
            <Form>
                <FormGroup>
                    <Label for="exampleEmail">Description</Label>
                    <Input type="email" name="email" id="exampleEmail" defaultValue="Walmart" />
                </FormGroup>
                <FormGroup>
                    <Label for="examplePassword">Password</Label>
                    <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
                </FormGroup>
            </Form>
            </div>
        );
    }
} 

class EditExpenseModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return (
        <div>
            <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>Edit Expense</ModalHeader>
                <ModalBody>
                    <EditForm />
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

class ExpenseCard extends React.Component {
    constructor(props) {
        super(props);
        var dateObj = new Date();
        var monthName = monthNames[dateObj.getUTCMonth()];
        var day = dateObj.getUTCDate();
        this.state = { description: "Walmart", monthName: monthName, day: day, storeName: this.props.storeName }
    }

    render() {
        return (
            <div>
                <Container >
                    <Jumbotron className="smallerjumb">
                        <Row>
                            <Col xs="2">
                                <div className="calendar-icon calendar-icon--single">
                                    <div className="calendar-icon__day">{this.state.day}</div>
                                    <div className="calendar-icon__month">{this.state.monthName}</div>
                                </div>
                            </Col>
                            <Col xs="2">
                            <img src="http://hernandoconnects.com/wp-content/uploads/2017/02/Icon-Placeholder.png" />
                            </Col>
                            <Col>{this.state.description}</Col>
                            <Col>.col</Col>
                            <Col><EditExpenseModal buttonLabel="Edit"/></Col>
                        </Row>
                    </Jumbotron>
                </Container>
            </div>
        );
    }
}

export default Expenses;