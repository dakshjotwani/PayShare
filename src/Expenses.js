import React from 'react'
import './Expenses.css'
import SplitOptions from './SplitOptions'
import Payer from './Payer'
import ReceiptSelect from './ReceiptSelect'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import FAButton from 'material-ui/Button';
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
    Form, FormGroup, Label, Input
} from 'reactstrap';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

class Expenses extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <div style={{ paddingTop: '0.75em' }}></div>
                    <ExpenseCard />
                    <ExpenseCard />
                    <ExpenseCard />
                    <ExpenseCard />
                    <ExpenseCard />
                    <ExpenseCard />
                    <ExpenseCard />
                    <ExpenseCard />
                    <ExpenseCard />
                    <div style={{ paddingTop: '1em' }}></div>
                </div>
                
                <FAButton variant="fab" color="secondary" aria-label="add" className="FAB">
                    <i className="material-icons">add</i>
                </FAButton>
                
                
            </div>
        );
    }
}

function FloatingActionButtons(props) {
    const { classes } = props;
    return (
        <div>
            <Button variant="fab" color="primary" aria-label="add" className={classes.button}>
                <i className="material-icons">note_add</i>
            </Button>
        </div>
    );
}

class NameElem extends React.Component {
    constructor(props) {
        super(props);
        this.style = {
            padding: '0',
            border: '0',
            marginBottom: '0.1em', marginLeft: '0.3em', marginRight: '0', marginTop: '0'
        };
    }
    render() {
        return (
            <Label for="name" onClick={this.props.onClick} style={this.style}>
                <span className="badge badge-info">
                    {this.props.name} {' '}
                    <span aria-hidden="true">&times;</span>
                </span>
            </Label>
        );
    }
}

class EditExpenseModal extends React.Component {
    constructor(props) {
        super(props);
        var Users = ["Parth Doshi", "Max Lin"];
        this.state = {
            modal: false,
            Users: Users,
            addUserValue: '',
            descValue: 'Walmart',
            date: moment()
        };
        if (Users.length !== 0) {
            this.state['payer'] = Users[0];
        }
        this.removeUser = this.removeUser.bind(this);
        this.addUser = this.addUser.bind(this);
        this.handleAddUserChange = this.handleAddUserChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        // If it was just opened
        if (this.state.modal === false) {
            this.setState({
                initalState: this.state,
                modal: true
            });
        } else {
            // If closing without changes
            this.setState(this.state.initalState);
        }
    }

    handleSelectPayer = (event) => {
        this.setState({ payer: event.target.value });
    }

    handleAddUserChange(e) {
        this.setState({ addUserValue: e.target.value });
    }

    removeUser(e) {
        const users = this.state.Users.slice();
        users.splice(e, 1);
        this.setState({ Users: users });
        if (users.length === 0) {
            this.setState({ payer: undefined });
        } else {
            this.setState({ payer: users[0] })
        }

    }

    addUser(e) {
        if (this.state.addUserValue.replace(/\s/g, '').length) {
            const users = this.state.Users.slice();
            users.push(this.state.addUserValue);
            this.setState({ Users: users })
        }
        this.setState({ addUserValue: '' })
        e.preventDefault();
    }

    onDescChange = (e) => {
        this.setState({ descValue: e.target.value });
    }

    onNumChange = (e) => {
        this.setState({ numValue: e.target.value });
    }

    onDateChange = (date) => {
        this.setState({ date: date });
    }

    handleSubmit(e) {
        // if everything is filled
        this.setState({
            modal: false
        });
        console.log("Users: ");
        for (var i = 0; i < this.state.Users.length; i++) {
            console.log(this.state.Users[i]);
        }
        console.log("Date: " + this.state.date);
        console.log("Description: " + this.state.descValue);
        console.log("Total Amount: " + this.state.numValue)
        console.log("Payer: " + this.state.payer)
        const { modal, payer, Users, ...rest } = this.state;
        this.props.updateParent(rest);
    }


    render() {
        const namelist = this.state.Users.map((User, index) =>
            <NameElem name={User} key={index} onClick={this.removeUser.bind(this, index)} />
        );
        return (
            <div>
                <Button color="danger" onClick={this.toggle}>
                    <i className="fas fa-pencil-alt"></i>
                </Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Edit Expense</ModalHeader>
                    <ModalBody>
                        <div>
                            Members: {' '}
                            {namelist}
                            <Form inline onSubmit={this.addUser}>
                                <FormGroup className="mb-2 mr-sm-2 mb-sm-0" style={{ paddingTop: '0.25em' }}>
                                    <Label for="addPeople" className="mr-sm-2">Add People</Label>
                                    <Input type="text" value={this.state.addUserValue} onChange={this.handleAddUserChange} name="addPeople" id="addPeople" placeholder="name" />
                                </FormGroup>
                                <Button>Submit</Button>
                            </Form>
                            <hr />
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    Date {' '}
                                    <DatePicker
                                        selected={this.state.date}
                                        onChange={this.onDateChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="description">Description</Label>
                                    <Input onChange={this.onDescChange}
                                        value={this.state.descValue}
                                        type="email" name="email" id="exampleEmail" required>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="totalAmount">Total Amount</Label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroupPrepend2">$</span>
                                        </div>
                                        <input type="number"
                                            placeholder='0.00'
                                            value={this.state.numValue}
                                            onChange={this.onNumChange}
                                            className="form-control" id="totalAmount" required>
                                        </input>
                                    </div>
                                </FormGroup>
                            </Form>
                        </div>
                        <Payer defaultPayer={this.state.payer} onChange={this.handleSelectPayer} users={this.state.Users} />
                        <SplitOptions users={this.state.Users} totalAmount={this.state.numValue} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleSubmit}>Save</Button>{' '}
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
        this.state = {
            description: "Walmart",
            monthName: monthName,
            day: day,
        }
    }

    updateParent = (rest) => {
        this.setState({
            description: rest.descValue,
            totalAmount: rest.numValue,
            monthName: monthNames[rest.date.month()],
            day: rest.date.date()
        });
    }

    render() {
        return (
            <div>
                <Jumbotron className="smallerjumb">
                    <Container >
                        <Row>
                            <Col xs="3">
                                <div className="calendar-icon calendar-icon--single">
                                    <div className="calendar-icon__day">{this.state.day}</div>
                                    <div className="calendar-icon__month">{this.state.monthName}</div>
                                </div>
                            </Col>
                            <Col xs="auto" className='centerVerticalLeft'>
                                <div>
                                    {this.state.description}
                                    <div>
                                    </div>
                                    Total: {this.state.totalAmount}
                                </div>
                            </Col>
                            {/*
                            <Col xs="1" className='centerVerticalLeft'>Total: {this.state.totalAmount}</Col>
                            */}
                            <Col xs="2" offset='8' className='centerVertical'>
                                <EditExpenseModal updateParent={this.updateParent} />
                            </Col>
                            <Col xs="2" offset='10' className='centerVertical'>
                                <ReceiptSelect />
                            </Col>
                        </Row>
                    </Container>
                </Jumbotron>
            </div>
        );
    }
}

export default Expenses;