import React from 'react'
import './Expenses.css'
import SplitOptions from './SplitOptions'
import Payer from './Payer'
import ReceiptSelect from './ReceiptSelect'
import DatePicker from 'material-ui/DatePicker'
import FAButton from 'material-ui/FloatingActionButton';
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
import { firebase, auth, db } from './fire'

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

class Expenses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: {},
            addModal: false
        }
        // Get a list of expenses for the specific user
        let userID = '61Ev1NWNjJZdH5bO2YGQvCt15wu2'
        let userExpenseListRef = db.collection('users').doc(userID).collection('expenseList')
        let newCards = {}
        userExpenseListRef.get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    let data = doc.data()
                    let cardProps = {
                        expenseId: doc.id,
                        date: new Date(data.date),
                        totalCost: data.totalCost,
                        individualCost: data.individualCost,
                        expenseReference: data.expenseReference,
                        name: data.name
                    }
                    newCards[doc.id] = cardProps
                });
                // Merge cards object
                const merged = { ...this.state.cards, ...newCards }
                this.state['cards'] = merged
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }

    getCurrentCards = () => {
        return this.state.cards
    }

    componentDidMount() {
        let self = this
        let cards = this.getCurrentCards()
        // Get a list of expenses for the specific user
        // Change to u
        let userID = 'dakshjotwani@gmail.com'
        let userExpenseListRef = db.collection('users').doc(userID).collection('expenseList').orderBy("date")
        userExpenseListRef.onSnapshot((snapshot) => {
            let newCards = {}
            let deleteCards = {}
            let cards = self.getCurrentCards()
            snapshot.docChanges.forEach((change) => {
                    
                if (change.type === "added" || change.type === "modified") {
                    let data = change.doc.data()
                    let cardProps = {
                        expenseId: change.doc.id,
                        date: new Date(data.date),
                        totalCost: data.totalCost,
                        individualCost: data.individualCost,
                        expenseReference: data.expenseReference,
                        name: data.name
                    }
                    newCards[change.doc.id] = cardProps
                }
                if (change.type === "removed") {
                    delete cards[change.doc.id]
                }
            });
            // Merge cards object
            const merged = {...cards, ...newCards}
            self.setState({ cards: merged })
        });
        /*
        userExpenseListRef.get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    // Attach a listener
                    userExpenseListRef.doc(doc.id).onSnapshot(function (doc) {
                        let merged = { ...self.state.cards }
                        merged[doc.id] = doc.data()
                        self.setState({
                            cards: merged
                        })
                    });
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
            */
    }

    addExpense = () => {
        const list = this.state.list.slice();
        list.push("more props");
        this.setState({ list: list });

    }

    toggleAddModal = () => {
        this.setState({
            addModal: !this.state.addModal
        })
    }

    render() {
        const cards = Object.keys(this.state.cards).reverse().map((key, index) =>
            <ExpenseCard {...this.state.cards[key]} key={key} />
        );

        return (
            <div>
                <div>
                    <div style={{ paddingTop: '0.75em' }}></div>
                    {cards}
                    <div id="end" style={{ paddingTop: '7em' }}></div>
                </div>
                <AddExpenseModal isOpen={this.state.addModal} toggle={this.toggleAddModal} />
                <div className="pull-right FAB">
                    <FAButton onClick={this.toggleAddModal} className="bttn" variant="fab" aria-label="add" >
                        <i className="material-icons">add</i>
                    </FAButton>
                </div>


            </div>
        );
    }
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

class AddExpenseModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Users: [],
            addUserValue: '',
            descValue: '',
            payer: undefined,
            numValue: undefined,
            date: new Date(),
            items: []
        }
        this.baseState = this.state
    }

    toggle = () => {
        this.resetState()
        this.props.toggle()
    }

    resetState() {
        this.setState(this.baseState)
    }

    handleSelectPayer = (event) => {
        this.setState({ payer: event.target.value });
    }

    handleAddUserChange = (e) => {
        this.setState({ addUserValue: e.target.value });
    }

    removeUser = (e) => {
        const users = this.state.Users.slice();
        users.splice(e, 1);
        this.setState({ Users: users });
        if (users.length === 0) {
            this.setState({ payer: undefined });
        } else {
            this.setState({ payer: users[0] })
        }

    }

    addUser = (e) => {
        if (this.state.addUserValue.replace(/\s/g, '').length) {
            const users = this.state.Users.slice();
            users.push(this.state.addUserValue);
            this.setState({ Users: users })
            if (users.length === 1) {
                this.setState({ payer: this.state.addUserValue })
            }
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

    onDateChange = (event, date) => {
        this.setState({ date: date });
    }

    handleSubmit = (e) => {
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
        this.resetState()
        this.props.toggle()
    }

    render() {
        const namelist = this.state.Users.map((User, index) =>
            <NameElem name={User} key={index} onClick={this.removeUser.bind(this, index)} />
        );
        return (
            <div>
                <Modal isOpen={this.props.isOpen} toggle={this.toggle} >
                    <ModalHeader toggle={this.toggle}>Add Expense</ModalHeader>
                    <ModalBody>
                        <div>
                            Members: {' '}
                            {namelist}
                            <Form inline onSubmit={this.addUser}>
                                <FormGroup className="mb-2 mr-sm-2 mb-sm-0" style={{ paddingTop: '0.25em' }}>
                                    {/*
                                    <Label for="addPeople" className="mr-sm-2">Add People</Label>
                                */}
                                    <Input type="text" value={this.state.addUserValue} onChange={this.handleAddUserChange} name="addPeople" id="addPeople" placeholder="Name" />
                                </FormGroup>
                                <Button>Submit</Button>
                            </Form>
                            <hr />
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    Date {' '}
                                    <DatePicker
                                        hintText="Date"
                                        value={this.state.date}
                                        autoOk={true}
                                        onChange={this.onDateChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="description">Description</Label>
                                    <Input onChange={this.onDescChange}
                                        value={this.state.descValue}
                                        name="description" required>
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
                        <div className="centerBlock">
                            <SplitOptions items={this.state.items} users={this.state.Users} totalAmount={this.state.numValue} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleSubmit}>Add</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
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
            descValue: '',
            date: new Date(),
            items: []
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

    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        let self = this
        let expenseRef = this.props.expenseRef
        if (expenseRef !== undefined) {
            expenseRef.get().then(doc => {
                if (doc.exists) {
                    let data = doc.data()
                    self.setState({
                        descValue: data.expenseName,
                        numValue: data.totalCost,
                        date: new Date(data.date),
                        items: data.items,
                        totalCost: data.totalCost,
                        name: data.name,
                        users: data.users,
                        Users: ["asdf"]
                    })
                } else {
                    console.log("No such document!");
                }
            })
                .catch(err => {
                    console.log('Error getting document', err);
                });
        }
    }
    

    toggle = () => {
        // If it was just opened
        if (this.state.modal === false) {
            this.loadData()
            this.setState({
                modal: true
            });
        } else {
            // If closing without changes
            this.setState(this.state.initalState);
            this.setState({
                modal: false
            })
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
            if (users.length === 1) {
                this.setState({ payer: this.state.addUserValue })
            }
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

    onDateChange = (event, date) => {
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
                                    {/*
                                    <Label for="addPeople" className="mr-sm-2">Add People</Label>
                                */}
                                    <Input type="text" value={this.state.addUserValue} onChange={this.handleAddUserChange} name="addPeople" id="addPeople" placeholder="Name" />
                                </FormGroup>
                                <Button>Submit</Button>
                            </Form>
                            <hr />
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    Date {' '}
                                    <DatePicker
                                        hintText="Date"
                                        value={this.state.date}
                                        autoOk={true}
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
                        <div className="centerBlock">
                            <SplitOptions items={this.state.items} users={this.state.Users} totalAmount={this.state.numValue} />
                        </div>
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
        this.state = {
                items: [],
            } 
    }

componentDidMount() {
    /*
    if (this.props.expenseReference !== undefined) {
        this.props.expenseReference.onSnapshot(doc => {
            if (doc.exists) {
                let data = doc.data()
                this.setState = ({
                    expenseName: data.expenseName,
                    date: new Date(data.date),
                    items: data.items,
                    totalCost: data.totalCost,
                    name: data.name,
                    users: data.users
                })
            } else {
                console.log("No such document!");
            }
        });
    }
    */
}

componentWillUnmount() {

}

getDay = (dateStr) => {
    let dateObj = new Date(this.props.date);
    return dateObj.getUTCDate();
}

getMonth = (dateStr) => {
    let dateObj = new Date(this.props.date);
    return monthNames[dateObj.getUTCMonth()];
}

updateParent = (rest) => {
    this.setState({
        description: rest.descValue,
        totalAmount: rest.numValue,
        monthName: monthNames[rest.date.getMonth()],
        day: rest.date.getDate(),
        year: rest.date.getFullYear()
    });
}

updateItemList = (list) => {
    this.setState({ items: list })
}

render() {
    return (
        <div>
            <Jumbotron className="smallerjumb">
                <Container >
                    <Row>
                        <Col xs="3">
                            <div className="calendar-icon calendar-icon--single">
                                <div className="calendar-icon__day">{this.getDay(this.props.date)}</div>
                                <div className="calendar-icon__month">{this.getMonth(this.props.date)}</div>
                            </div>
                        </Col>
                        <Col xs="auto" className='centerVerticalLeft'>
                            <div>
                                {this.props.name}
                                <div>
                                </div>
                                Total: {this.props.totalCost}
                            </div>
                        </Col>
                        {/*
                            <Col xs="1" className='centerVerticalLeft'>Total: {this.state.totalAmount}</Col>
                            */}
                        <Col xs="2" offset='8' className='centerVertical'>
                            <EditExpenseModal updateParent={this.updateParent} expenseRef={this.props.expenseReference} />
                        </Col>
                        <Col xs="2" offset='10' className='centerVertical'>
                            <ReceiptSelect onSave={this.updateItemList} />
                        </Col>
                    </Row>
                </Container>
            </Jumbotron>
        </div>
    );
}
}

export default Expenses;
