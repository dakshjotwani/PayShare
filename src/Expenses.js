import React from 'react'
import './Expenses.css'
import SplitOptions from './SplitOptions'
import Payer from './Payer'
import DatePicker from 'material-ui/DatePicker'
import FAButton from 'material-ui/FloatingActionButton';
import {
    Container,
    Row,
    Col,
    Jumbotron,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form, FormGroup, Label, Input,
    Alert 
} from 'reactstrap';
import { firebase, db } from './fire'

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
        let userEmail = firebase.auth().currentUser.email 
        let userExpenseListRef = db.collection('users').doc(userEmail).collection('expenseList').orderBy('date','asc')
        let newCards = {}
        userExpenseListRef.get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    let data = doc.data()
                    let cardProps = {
                        expenseId: doc.id,
                        date: data.date.toDate(),
                        totalCost: data.totalCost,
                        individualCost: data.individualCost,
                        expenseReference: data.expenseReference,
                        name: data.name,
                        userCost: data.userCost,
                        userOwe: data.userOwe
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
        let userEmail = firebase.auth().currentUser.email 
        let userExpenseListRef = db.collection('users').doc(userEmail).collection('expenseList').orderBy('date','asc')
        userExpenseListRef.onSnapshot((snapshot) => {
            let newCards = {}
            let deleteCards = {}
            let cards = self.getCurrentCards()
            snapshot.docChanges.forEach((change) => {
                if (change.type === "added" || change.type === "modified") {
                    let data = change.doc.data()
                    let cardProps = {
                        expenseId: change.doc.id,
                        date: data.date.toDate(),
                        totalCost: data.totalCost,
                        individualCost: data.individualCost,
                        expenseReference: data.expenseReference,
                        name: data.name,
                        userCost: data.userCost,
                        userOwe: data.userOwe
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
                <h3 style={{ paddingTop: '0.5em' }}> Your Expenses </h3>
                <div>
                    <div style={{ paddingTop: '0.75em' }}></div>
                    {cards}
                    <div id="end" style={{ paddingTop: '7em' }}></div>
                </div>
                <AddExpenseModal isOpen={this.state.addModal} toggle={this.toggleAddModal} />
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

class ExpenseModal extends React.Component {
    constructor(props) {
        super(props);
        this.title = "Expense Modal"
        this.submitLabel = "Submit"
        this.cancelLabel = "Cancel"
        this.state = {
            alertEmail: false,
            alertMissing: false,
        }
    }

    dismissAlertEmail = () => {
        this.setState({alertEmail: false})
    }

    dismissAlertMissing = () => {
        this.setState({alertMissing: false})
    }

    handleSelectPayer = (event) => {
        const index = this.state.Users.indexOf(event.target.value);
        this.setState({
            payerName: event.target.value,
            payerEmail: this.state.EmailIds[index]
        });
    }

    handleAddUserChange = (e) => {
        this.setState({ addUserValue: e.target.value });
    }
    
    removeUser = (e) => {
        const userEmail = this.state.EmailIds[e]
        // Remove user from local state
        var usersObj = Object.assign({}, this.state.splitUsersObj)
        delete usersObj[userEmail]
        const users = this.state.Users.slice();
        const emailIds = this.state.EmailIds.slice();
        users.splice(e, 1);
        emailIds.splice(e, 1);
        this.setState({
            Users: users,
            EmailIds: emailIds
        });
        if (users.length === 0) {
            this.setState({
                payerName: undefined,
                payerEmail: undefined,
                splitUsersObj: usersObj
            });
        } else {
            this.setState({
                payerName: users[0],
                payerEmail: emailIds[0],
                splitUsersObj: usersObj
            });
        }
    }

    addUser = (e) => {
        const userEmail = this.state.addUserValue; 
        if (this.state.addUserValue.replace(/\s/g, '').length) {
            db.collection('users').doc(userEmail).get()
                .then((doc) => {
                    if (doc.exists) {
                        let users = this.state.Users.slice();
                        let emailIds = this.state.EmailIds.slice();
                        // user already added error
                        if (emailIds.includes(doc.data().email)) {
                            this.setState({ 
                                alertEmail: true,
                                alertEmailText: "User already added.", 
                                addUserValue: '' })
                            return
                        }
                        // Add to local split user object
                        let userObj = this.state.splitUsersObj
                        let newUser = {
                            name: doc.data().name,
                            email: userEmail,
                            userCost: 0,
                            userOwe: 0
                        }
                        // merge
                        const mergeUsers = {...this.state.splitUsersObj, [userEmail]: newUser}
                        this.setState({splitUsersObj: mergeUsers})

                        users.push(doc.data().name);
                        emailIds.push(userEmail);
                        this.setState({
                            Users: users,
                            EmailIds: emailIds,
                            alertEmail: false
                        });
                        if (users.length === 1) {
                            this.setState({
                                payerName: doc.data().name,
                                payerEmail: userEmail
                            });
                        }
                    } else {
                        this.setState({ 
                            alertEmail: true,
                            alertEmailText: "User does not exist.",
                            addUserValue: '' })
                    }
                });
        } 
        this.setState({ 
            addUserValue: ''
        }) 
        e.preventDefault()
    }

    onDescChange = (e) => {
        this.setState({ descValue: e.target.value });
    }

    onNumChange = (e) => {
        this.setState({ numValue: parseFloat(e.target.value) });
    }

    getTotalAmount = () => {
        return this.state.numValue;
    }

    onDateChange = (event, date) => {
        this.setState({ date: date });
    }

    validateForm() {
        const descLen = this.state.descValue.trim().length
        if(this.state.Users.length === 0
                || descLen === 0
                || this.state.numValue === undefined
                || this.state.payerEmail === undefined) {
            this.setState({alertMissing: true})
            return false
        }

        return true
    }

    updateExpenseCosts = (newUsersObj) => {
        this.setState({splitUsersObj: newUsersObj})
    }

    updateSplitType = (splitType) => {
        this.setState({splitType: splitType});
    }

    uploadExpenseCosts = () => {
        // Update userCost and userOwe for each user
        let self = this
        // Need to fix when expenseReference doesnt exist yet
                    let usersObj = { ...this.state.splitUsersObj }
                    // Reset all users to 0
                    // TODO RETURN WHOLE LIST INSTEAD NOT JUST USERS AFFECTED
                    // Write to database
                    this.props.expenseReference.update({ users: usersObj })
    }

    handleSubmit = (e) => {
        if (!this.validateForm()) {
            return
        }
        var usersObj = {};
        usersObj = {...this.state.splitUsersObj}
        db.collection('expenses').add({
            date: this.state.date,
            expenseName: this.state.descValue,
            items: [],
            payerName: this.state.payerName,
            payerEmail: this.state.payerEmail,
            totalCost: parseFloat(this.state.numValue),
            users: usersObj
        }).then((docref) => {
            for (var i = 0; i < this.state.EmailIds.length; i++) {
                db.collection('users')
                    .doc(this.state.EmailIds[i])
                    .collection('expenseList')
                    .doc(docref.id)
                    .set({
                        date: this.state.date,
                        expenseReference: docref,
                        name: this.state.descValue,
                        totalCost: parseFloat(this.state.numValue),
                        userCost: usersObj[this.state.EmailIds[i]].userCost,
                        userOwe: usersObj[this.state.EmailIds[i]].userOwe
                    });
            }
        }).finally(() => {
            if (!this.hasEditButton) {
                this.resetState()
            }
        });
        // if everything is filled
        this.setState({
            modal: false
        });
    }

    render() {
        const namelist = this.state.Users.map((User, index) =>
            <NameElem
                name={User}
                key={index}
                onClick={this.removeUser.bind(this, index)} />
        );
        const modalButton = this.hasEditButton ? (
            <Button color="danger" onClick={this.toggle}>
                <i className="fas fa-pencil-alt"></i>
            </Button>
        ) : (
            <div className="pull-right FAB">
                <FAButton
                    onClick={this.toggle}
                    className="bttn"
                    variant="fab"
                    aria-label="add" >
                    <i className="material-icons">add</i>
                </FAButton>
            </div>
        )

        return (
            <div>
                {modalButton}
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle} >
                    <ModalHeader toggle={this.toggle}>
                        {this.title}
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <Alert
                                color="danger"
                                isOpen={this.state.alertMissing}
                                toggle={this.dismissAlertMissing}>
                                Please fill out all fields.
                            </Alert>
                            <Alert
                                color="danger"
                                isOpen={this.state.alertEmail}
                                toggle={this.dismissAlertEmail}>
                                {this.state.alertEmailText}
                            </Alert>
                            Members: {' '}
                            {namelist}
                            <Form inline onSubmit={this.addUser}>
                                <FormGroup
                                    className="mb-2 mr-sm-2 mb-sm-0"
                                    style={{ paddingTop: '0.25em' }}>
                                    {/*
                                    <Label
                                        for="addPeople"
                                        className="mr-sm-2">
                                        Add People
                                    </Label>
                                    */}
                                    <Input
                                        type="text"
                                        value={this.state.addUserValue}
                                        onChange={this.handleAddUserChange}
                                        name="addPeople"
                                        id="addPeople"
                                        placeholder="Email" />
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
                                    <Label
                                        for="description">
                                        Description
                                    </Label>
                                    <Input onChange={this.onDescChange}
                                        value={this.state.descValue}
                                        name="description" 
                                        required>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label
                                        for="totalAmount">
                                        Total Amount
                                    </Label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span
                                                className="input-group-text"
                                                id="inputGroupPrepend2">
                                                $
                                                {/*TODO Add Currency Support*/}
                                            </span>
                                        </div>
                                        <input type="number"
                                            placeholder='0.00'
                                            value={this.state.numValue}
                                            onChange={this.onNumChange}
                                            className="form-control"
                                            id="totalAmount"
                                            required>
                                        </input>
                                    </div>
                                </FormGroup>
                            </Form>
                        </div>
                        <Payer
                            defaultPayer={this.state.payerName}
                            onChange={this.handleSelectPayer}
                            users={this.state.Users} />
                        <div className="centerBlock">
                            <SplitOptions
                                updateSplitType={this.updateSplitType}
                                updateExpenseCosts={this.updateExpenseCosts}
                                {...this.state}
                                splitUsersObj={this.state.splitUsersObj}
                                expenseReference={this.props.expenseReference}
                                users={this.state.Users}
                                totalAmount={this.state.numValue}
                                getTotalAmount={this.getTotalAmount.bind(this)}/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary"
                            onClick={this.handleSubmit}>
                            {this.submitLabel}
                        </Button>{' '}
                        <Button color="secondary"
                            onClick={this.toggle}>
                            {this.cancelLabel}
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

class AddExpenseModal extends ExpenseModal {
    constructor(props) {
        super(props);
        this.state = {
            Users: [],
            addUserValue: '',
            descValue: '',
            payerName: undefined,
            payerEmail: undefined,
            numValue: undefined,
            date: new Date(),
            EmailIds: [],
            items: [],
            splitUsersObj: {},
            userCosts: {},
            modal: false,
            alertEmail: false,
            alertMissing: false
        }
        this.baseState = this.state
        this.title = "Add Expense"
        this.submitLabel = "Add"
        this.cancelLabel = "Cancel"
        this.validateForm = this.validateForm.bind(this)
    }

    toggle = () => {
        this.resetState()
        this.setState({ modal: !this.state.modal })
    }

    resetState() {
        this.setState(this.baseState)
    }

    handleSubmit = (e) => {
        if (!this.validateForm()) {
            return
        }
        var usersObj = { ...this.state.splitUsersObj };
        
        db.collection('expenses').add({
            date: this.state.date,
            expenseName: this.state.descValue,
            items: [],
            payerName: this.state.payerName,
            payerEmail: this.state.payerEmail,
            totalCost: parseFloat(this.state.numValue),
            users: usersObj
        }).then((docref) => {
            for (var i = 0; i < this.state.EmailIds.length; i++) {
                let userEmail = this.state.EmailIds[i]
                db.collection('users')
                    .doc(this.state.EmailIds[i])
                    .collection('expenseList')
                    .doc(docref.id)
                    .set({
                        date: this.state.date,
                        expenseReference: docref,
                        name: this.state.descValue,
                        totalCost: parseFloat(this.state.numValue),
                        userCost: usersObj[userEmail].userCost,
                        userOwe: usersObj[userEmail].userOwe
                    });
            }
        }).finally(() => {
            if (!this.hasEditButton) {
                this.resetState()
            }
        });
        // if everything is filled
        this.setState({
            modal: false
        });
    }
}

class EditExpenseModal extends ExpenseModal {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            Users: [],
            addUserValue: '',
            descValue: '',
            date: new Date(),
            items: [],
            alertEmail: false,
            alertMissing: false,
            splitUsersObj: {}
        };
        this.hasEditButton = true
        this.title = "Edit Expense"

        this.removeUser = this.removeUser.bind(this);
        this.addUser = this.addUser.bind(this);
        this.handleAddUserChange = this.handleAddUserChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.toggle = this.toggle.bind(this);
        this.validateForm = this.validateForm.bind(this)
    }

    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        let self = this
        this.props.expenseReference.get().then(doc => {
            if (doc.exists) {
                let data = doc.data()
                let users = [];
                let emailIds = [];
                for (let user in data.users) {
                    users.push(data.users[user].name);
                    emailIds.push(data.users[user].email);
                }
                self.setState({
                    descValue: data.expenseName,
                    numValue: data.totalCost,
                    date: data.date.toDate(),
                    items: data.items,
                    totalCost: data.totalCost,
                    name: data.name,
                    EmailIds: emailIds,
                    users: data.users,
                    splitUsersObj: data.users,
                    Users: users,
                    payerName: data.payerName,
                    payerEmail: data.payerEmail,
                    initialEmailIds: emailIds,
                })
            } else {
                console.log("No such document!");
            }
        })
            .catch(err => {
                console.log('Error getting document', err);
            })
            .finally(() => {
            })
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

    handleSubmit = (e) => {
        if (!this.validateForm()) return;
        
        let toRemove = this.state.initialEmailIds.slice();
        toRemove = toRemove.filter((i) => {
            return this.state.EmailIds.indexOf(i) < 0;
        })

        let usersObj = { ...this.state.splitUsersObj }
        this.props.expenseReference.set({
            date: this.state.date, //.toISOString().substring(0, 10),
            expenseName: this.state.descValue,
            totalCost: parseFloat(this.state.numValue),
            users: usersObj,
            payerName: this.state.payerName,
            payerEmail: this.state.payerEmail
        }).then((docref) => {
            for (let i = 0; i < this.state.EmailIds.length; i++) {
                let currUserObj = usersObj[this.state.EmailIds[i]]
                db.collection('users')
                    .doc(this.state.EmailIds[i])
                    .collection('expenseList')
                    .doc(this.props.expenseReference.id)
                    .set({
                        date: this.state.date,
                        expenseReference: this.props.expenseReference,
                        name: this.state.descValue,
                        totalCost: parseFloat(this.state.numValue),
                        userOwe: currUserObj.userOwe,
                    });
            }
            for (let i = 0; i < toRemove.length; i++) {
                db.collection('users')
                    .doc(toRemove[i])
                    .collection('expenseList')
                    .doc(this.props.expenseReference.id)
                    .delete();
                this.props.expenseReference.get().then((doc) => {
                    let data = doc.data();
                    let update = {};
                    if (data.payerEmail === toRemove[i]) {
                        update["payerName"] = null;
                        update["payerEmail"] = null;
                    }
                    let newUsers = data.users;
                    newUsers[toRemove[i]] = firebase.firestore.FieldValue.delete();
                    this.props.expenseReference.update(update);
                });
            }
            this.props.expenseReference
                .collection('items')
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        let itemUsers = doc.data()["users"];
                        let newUsers = {};
                        for (let key in itemUsers) {
                            if (toRemove.indexOf(itemUsers[key]) < 0) {
                                newUsers[key] = itemUsers[key];
                            }
                        }
                        this.props.expenseReference
                            .collection('items')
                            .doc(doc.id)
                            .update({users: newUsers});
                    });
                });
        }).finally(() => {
            if (!this.hasEditButton) {
                this.resetState()
            }
        });
        // if everything is filled
        this.setState({
            modal: false
        });
    }
}

class ExpenseCard extends React.Component {
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
            year: rest.date.getFullYear(),
            userCost: 0,
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
                            <Col xs="1">
                                <div className="calendar-icon calendar-icon--single">
                                    <div className="calendar-icon__day">{this.getDay(this.props.date)}</div>
                                    <div className="calendar-icon__month">{this.getMonth(this.props.date)}</div>
                                </div>
                            </Col>
                            <Col xs="auto" className='centerVerticalLeft'>
                                <div className="leftAlignText" style={{}}>
                                    <h5>{this.props.name}</h5>
                                    <div className="leftAlignText">
                                    </div>
                                    Total: <strong>{parseFloat(this.props.totalCost).toFixed(2)}</strong>
                                </div>
                                <div className="leftAlignText">
                                    {this.props.userOwe < 0 ? "Owe:" : "Owed:"} <strong>
                                        <font color={this.props.userOwe < 0 ? "red" : "green"}>
                                            {parseFloat(Math.abs(this.props.userOwe)).toFixed(2)}
                                        </font>
                                    </strong>
                                </div>
                            </Col>
                            {/*
                            <Col xs="1" className='centerVerticalLeft'>Total: {this.state.totalAmount}</Col>
                            */}
                            <Col xs="1" className='centerVertical'>
                                <EditExpenseModal updateParent={this.updateParent} expenseReference={this.props.expenseReference} />
                            </Col>
                        </Row>
                    </Container>
                </Jumbotron>
            </div>
        );
    }
}

export default Expenses;
