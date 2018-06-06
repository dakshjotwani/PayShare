import React from 'react';
import PropTypes from 'prop-types';
import './Expenses.css';
import SplitOptions from './SplitOptions';
import Payer from './Payer';
import DatePicker from 'material-ui/DatePicker';
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
    InputGroup, InputGroupAddon,
    Alert,
} from 'reactstrap';
import {firebase, db} from './fire';
import {stringToCents, centsToString} from './algs2';

import * as currencies from './currencies.json';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** @override Class representing /Expense route */
class Expenses extends React.Component {
    /**
     * @constructor
     * @param {object} props passed down by parent
     */
    constructor(props) {
        super(props);
        this.state = {
            cards: {},
            addModal: false,
        };
    }

    /** Subscribe to user's firestore expense list to display cards */
    componentDidMount() {
        // Get a list of expenses for the specific user
        let userEmail = firebase.auth().currentUser.email;
        let userExpenseListRef = db.collection('users')
            .doc(userEmail)
            .collection('expenseList')
            .orderBy('date', 'asc');
        userExpenseListRef.onSnapshot((snapshot) => {
            let newCards = {};
            let cards = this.state.cards;
            snapshot.docChanges.forEach((change) => {
                if (change.type === 'added' || change.type === 'modified') {
                    let data = change.doc.data();
                    let cardProps = {
                        expenseId: change.doc.id,
                        date: data.date.toDate(),
                        currency: data.currency,
                        totalCost: data.totalCost,
                        expenseReference: data.expenseReference,
                        name: data.name,
                        userOwe: data.userOwe,
                    };
                    newCards[change.doc.id] = cardProps;
                }
                if (change.type === 'removed') {
                    delete cards[change.doc.id];
                }
            });
            // Merge cards object
            const merged = {...cards, ...newCards};
            this.setState({cards: merged});
        });
    }

    /**
     * Renders Expense component
     * @return {object} JSX to render /Expense
     */
    render() {
        const cards = Object
            .keys(this.state.cards)
            .reverse()
            .map((key, index) =>
            <ExpenseCard {...this.state.cards[key]} key={key} />
        );
        return (
            <div>
                <h3 style={{paddingTop: '0.5em'}}>Your Expenses</h3>
                <div>
                    <div style={{paddingTop: '0.75em'}}></div>
                    {cards}
                    <div id="end" style={{paddingTop: '7em'}}></div>
                </div>
                <AddExpenseModal
                    isOpen={this.state.addModal}
                />
            </div>
        );
    }
}

/** @override Class to render expense name/description neatly */
class NameElem extends React.Component {
    /**
     * @constructor
     * @param {object} props passed down by parent
     */
    constructor(props) {
        super(props);
        this.style = {
            padding: '0',
            border: '0',
            marginBottom: '0.1em',
            marginLeft: '0.3em',
            marginRight: '0',
            marginTop: '0',
        };
    }

    /**
     * Renders NameElem component
     * @return {JSX} to render expense title text
     */
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

NameElem.propTypes = {
    onClick: PropTypes.func,
    name: PropTypes.string,
};

/** @override Class to render add/edit expense modal */
class ExpenseModal extends React.Component {
    /**
     * @constructor
     * @param {object} props passed down by parent
     */
    constructor(props) {
        super(props);
        this.title = 'Expense Modal';
        this.submitLabel = 'Submit';
        this.cancelLabel = 'Cancel';
        this.state = {
            Users: [],
            currency: 'USD',
            addUserValue: '',
            descValue: '',
            payerName: undefined,
            payerEmail: undefined,
            numValue: undefined,
            splitType: null,
            date: new Date(),
            EmailIds: [],
            items: [],
            splitUsersObj: {},
            userCosts: {},
            modal: false,
            alertEmail: false,
            alertMissing: false,
        };
        this.toggle = this.toggle.bind(this);
        this.dismissAlertEmail = this.dismissAlertEmail.bind(this);
        this.dismissAlertMissing = this.dismissAlertMissing.bind(this);
        this.handleSelectPayer = this.handleSelectPayer.bind(this);
        this.handleAddUserChange = this.handleAddUserChange.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.addUser = this.addUser.bind(this);
        this.onDescChange = this.onDescChange.bind(this);
        this.onNumChange = this.onNumChange.bind(this);
        this.onCurrencyChange = this.onCurrencyChange.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.updateExpenseCosts = this.updateExpenseCosts.bind(this);
        this.updateSplitType = this.updateSplitType.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    /** Opens/closes expense modal */
    toggle() {
        this.setState({modal: !this.state.modal});
    }

    /** Dismisses email validation alert */
    dismissAlertEmail() {
        this.setState({alertEmail: false});
    }

    /** Dismisses missing fields alert */
    dismissAlertMissing() {
        this.setState({alertMissing: false});
    }

    /**
     * Updates payer details
     * @param {object} event that occured when method was called
     */
    handleSelectPayer(event) {
        const index = this.state.Users.indexOf(event.target.value);
        this.setState({
            payerName: event.target.value,
            payerEmail: this.state.EmailIds[index],
        });
    }

    /**
     * Update add user form field to state
     * @param {object} e (event) that occured when method was called
     */
    handleAddUserChange(e) {
        this.setState({addUserValue: e.target.value});
    }

    /**
     * Remove user from state
     * @param {object} e (event) that occured when method was called
     */
    removeUser(e) {
        const userEmail = this.state.EmailIds[e];
        // Remove user from local state
        let usersObj = Object.assign({}, this.state.splitUsersObj);
        delete usersObj[userEmail];
        const users = this.state.Users.slice();
        const emailIds = this.state.EmailIds.slice();
        users.splice(e, 1);
        emailIds.splice(e, 1);
        this.setState({
            Users: users,
            EmailIds: emailIds,
            splitType: this.state.splitType !== 'item' ? null : 'item',
        });
        if (users.length === 0) {
            this.setState({
                payerName: undefined,
                payerEmail: undefined,
                splitUsersObj: usersObj,
            });
        } else {
            this.setState({
                payerName: users[0],
                payerEmail: emailIds[0],
                splitUsersObj: usersObj,
            });
        }
    }

    /**
     * Add user to state
     * @param {object} e (event) that occured when method was called
     */
    addUser(e) {
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
                                alertEmailText: 'User already added.',
                                addUserValue: '',
                            });
                            return;
                        }
                        // Add to local split user object
                        // let userObj = this.state.splitUsersObj
                        let newUser = {
                            name: doc.data().name,
                            email: userEmail,
                            userCost: 0,
                            userOwe: 0,
                        };
                        // merge
                        const mergeUsers = {
                            ...this.state.splitUsersObj,
                            [userEmail]: newUser,
                        };
                        this.setState({splitUsersObj: mergeUsers});

                        users.push(doc.data().name);
                        emailIds.push(userEmail);
                        this.setState({
                            Users: users,
                            EmailIds: emailIds,
                            alertEmail: false,
                            splitType: this.state.splitType !== 'item'
                                ? null : 'item',
                        });
                        if (users.length === 1) {
                            this.setState({
                                payerName: doc.data().name,
                                payerEmail: userEmail,
                            });
                        }
                    } else {
                        this.setState({
                            alertEmail: true,
                            alertEmailText: 'User does not exist.',
                            addUserValue: '',
                        });
                    }
                });
        }
        this.setState({
            addUserValue: '',
        });
        e.preventDefault();
    }

    /**
     * Update title/description to state on change
     * @param {object} e (event) that occured when method was called
     */
    onDescChange(e) {
        this.setState({descValue: e.target.value});
    }

    /**
     * Update totalCost to state on change
     * @param {object} e (event) that occured when method was called
     */
    onNumChange(e) {
        if (e.target.value !== ''
            && e.target.value.match(/^[0-9]*(|\.[0-9]{1,2})$/) === null) return;
        this.setState({
            numValue: e.target.value,
            splitType: this.state.splitType !== 'item' ? null : 'item',
        });
    }

    /**
     * Update currency to state on change
     * @param {object} e (event) that occured when method was called
     */
    onCurrencyChange(e) {
        this.setState({
            currency: e.target.value,
        });
    }

    /**
     * Update date to state on change
     * @param {object} event that occured when method was called
     * @param {Date} date selected by user
     */
    onDateChange(event, date) {
        this.setState({date: date});
    }

    /**
     * Performs form validation and displays alerts accordingly
     * @return {boolean} true if valid, false otherwise
     */
    validateForm() {
        const descLen = this.state.descValue.trim().length;
        if (this.state.Users.length === 0
                || descLen === 0
                || this.state.numValue === undefined
                || this.state.payerEmail === undefined
                || this.state.splitType === null) {
            this.setState({alertMissing: true});
            return false;
        }
        return true;
    }

    /**
     * Updates expense costs for all users. Method is passed as a prop
     * to children to update parent
     * @param {object} newUsersObj users object with updated expense costs
     */
    updateExpenseCosts(newUsersObj) {
        this.setState({splitUsersObj: newUsersObj});
    }

    /**
     * Updates expense split type. Method is passed as a prop to children
     * to update parent
     * @param {string} splitType 'equal', 'unequal', or 'item'
     */
    updateSplitType(splitType) {
        this.setState({splitType: splitType});
    }

    /**
     * Renders Expense Modal component
     * @return {JSX} to render expense modal
     */
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
        );

        let currencyOptions = [];
        for (let key in currencies) {
            if (currencies.hasOwnProperty(key)) {
                currencyOptions.push((
                    <option key={key} value={key}>{key}</option>
                ));
            }
        }

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
                                <InputGroup>
                                    <Input
                                        type="text"
                                        value={this.state.addUserValue}
                                        onChange={this.handleAddUserChange}
                                        name="addPeople"
                                        id="addPeople"
                                        placeholder="Email" />
                                    <InputGroupAddon addonType="append">
                                        <Button>
                                            <i className="fas fa-plus"></i>
                                        </Button>
                                    </InputGroupAddon>
                                </InputGroup>
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
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            {
                                                currencies[this.state.currency]
                                                ?currencies[this.state.currency]
                                                    .symbol
                                                :currencies['USD'].symbol
                                            }
                                        </InputGroupAddon>
                                        <Input type="number"
                                            placeholder='0.00'
                                            value={this.state.numValue}
                                            onChange={this.onNumChange}
                                            className="form-control"
                                            pattern="^\d+(?:\.\d{1,2})?$"
                                            id="totalAmount"
                                            required>
                                        </Input>
                                        <div className="input-group-append">
                                            <select
                                                className="input-group-text
                                                custom-select"
                                                onChange={this.onCurrencyChange}
                                                value={this.state.currency}
                                            >
                                                {currencyOptions}
                                            </select>
                                        </div>
                                    </InputGroup>
                                </FormGroup>
                            </Form>
                        </div>
                        <Payer
                            defaultPayer={this.state.payerName}
                            onChange={this.handleSelectPayer}
                            users={this.state.Users} />
                        <div className="centerBlock">
                            <SplitOptions
                                isActive={!this.state.numValue}
                                splitType={this.state.splitType}
                                updateSplitType={this.updateSplitType}
                                updateExpenseCosts={this.updateExpenseCosts}
                                {...this.state}
                                splitUsersObj={this.state.splitUsersObj}
                                expenseReference={this.props.expenseReference}
                                users={this.state.Users}
                                currency={this.state.currency}
                                totalAmount={this.state.numValue}
                            />
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

ExpenseModal.propTypes = {
    expenseReference: PropTypes.object,
};

/** @override Class extends ExpenseModal to handle adding expenses */
class AddExpenseModal extends ExpenseModal {
    /**
     * @constructor
     * @param {object} props passed down by parent
     */
    constructor(props) {
        super(props);
        this.baseState = this.state;
        this.title = 'Add Expense';
        this.submitLabel = 'Add';
        this.cancelLabel = 'Cancel';
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /** Opens/closes a clean expense modal */
    toggle() {
        this.setState(this.baseState);
        super.toggle();
    }

    /**
     * Verifies form entries and adds expense to database
     * @param {object} e (event) that invoked the method
     */
    handleSubmit(e) {
        if (!this.validateForm()) {
            return;
        }
        let usersObj = {...this.state.splitUsersObj};

        db.collection('expenses').add({
            date: this.state.date,
            expenseName: this.state.descValue,
            splitType: this.state.splitType,
            payerName: this.state.payerName,
            payerEmail: this.state.payerEmail,
            currency: this.state.currency,
            totalCost: stringToCents(this.state.numValue),
            users: usersObj,
        }).then((docref) => {
            for (let i = 0; i < this.state.EmailIds.length; i++) {
                let userEmail = this.state.EmailIds[i];
                db.collection('users')
                    .doc(this.state.EmailIds[i])
                    .collection('expenseList')
                    .doc(docref.id)
                    .set({
                        date: this.state.date,
                        expenseReference: docref,
                        name: this.state.descValue,
                        totalCost: stringToCents(this.state.numValue),
                        userCost: usersObj[userEmail].userCost,
                        userOwe: usersObj[userEmail].userOwe,
                        currency: this.state.currency,
                    });
            }
        }).finally(() => {
            this.setState(this.baseState);
        });
        super.toggle();
    }
}

/** @override Class extends ExpenseModal to handle editing of expenses */
class EditExpenseModal extends ExpenseModal {
    /**
     * @constructor
     * @param {object} props passed down by parent
     */
    constructor(props) {
        super(props);
        this.hasEditButton = true;
        this.title = 'Edit Expense';

        this.toggle = this.toggle.bind(this);
        this.loadData = this.loadData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /** Loads expense data when modal is mounted */
    componentDidMount() {
        this.loadData();
    }

    /** Loads expense data into state from database */
    loadData() {
        this.props.expenseReference.get().then((doc) => {
            if (doc.exists) {
                let data = doc.data();
                let users = [];
                let emailIds = [];
                for (let user in data.users) {
                    if (data.users.hasOwnProperty(user)) {
                        users.push(data.users[user].name);
                        emailIds.push(data.users[user].email);
                    }
                }
                this.setState({
                    descValue: data.expenseName,
                    currency: data.currency,
                    numValue: centsToString(data.totalCost),
                    splitType: data.splitType,
                    date: data.date.toDate(),
                    items: data.items,
                    totalCost: centsToString(data.totalCost),
                    name: data.name,
                    EmailIds: emailIds,
                    users: data.users,
                    splitUsersObj: data.users,
                    Users: users,
                    payerName: data.payerName,
                    payerEmail: data.payerEmail,
                    initialEmailIds: emailIds,
                });
            } else {
                console.log('No such document!');
            }
        }).catch((err) => {
            console.log('Error getting document', err);
        });
    }

    /** Opens/closes modal based on state */
    toggle() {
        // If it was just opened
        if (this.state.modal === false) {
            this.loadData();
            this.setState({
                modal: true,
            });
        } else {
            // If closing without changes
            this.setState(this.state.initalState);
            this.setState({
                modal: false,
            });
        }
    }

    /**
     * Validates data and writes updates to database
     * @param {object} e (event) which invoked the method
     */
    handleSubmit(e) {
        if (!this.validateForm()) return;

        let toRemove = this.state.initialEmailIds.slice();
        toRemove = toRemove.filter((i) => {
            return this.state.EmailIds.indexOf(i) < 0;
        });

        let usersObj = {...this.state.splitUsersObj};
        this.props.expenseReference.set({
            date: this.state.date,
            expenseName: this.state.descValue,
            splitType: this.state.splitType,
            totalCost: stringToCents(this.state.numValue),
            currency: this.state.currency,
            users: usersObj,
            payerName: this.state.payerName,
            payerEmail: this.state.payerEmail,
        }).then((docref) => {
            for (let i = 0; i < this.state.EmailIds.length; i++) {
                let currUserObj = usersObj[this.state.EmailIds[i]];
                db.collection('users')
                    .doc(this.state.EmailIds[i])
                    .collection('expenseList')
                    .doc(this.props.expenseReference.id)
                    .set({
                        date: this.state.date,
                        expenseReference: this.props.expenseReference,
                        name: this.state.descValue,
                        currency: this.state.currency,
                        totalCost: stringToCents(this.state.numValue),
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
                        update['payerName'] = null;
                        update['payerEmail'] = null;
                    }
                    let newUsers = data.users;
                    newUsers[toRemove[i]] = firebase
                                                .firestore
                                                .FieldValue
                                                .delete();
                    this.props.expenseReference.update(update);
                });
            }
            this.props.expenseReference
                .collection('items')
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        let itemUsers = doc.data()['users'];
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
                this.resetState();
            }
        });
        // if everything is filled
        this.setState({
            modal: false,
        });
    }
}

/** @override Class to render an expense card */
class ExpenseCard extends React.Component {
    /**
     * @constructor
     * @param {object} props passed down by parent
     */
    constructor(props) {
        super(props);
        this.getDay = this.getDay.bind(this);
        this.getMonth = this.getMonth.bind(this);
    }

    /**
     * Gets day from this.props.date
     * @return {number} day of the month
     */
    getDay() {
        // let dateObj = new Date(this.props.date);
        return this.props.date.getUTCDate();
    }

    /**
     * Gets month from this.props.date
     * @return {number} month of the year
     */
    getMonth() {
        // let dateObj = new Date(this.props.date);
        return monthNames[this.props.date.getUTCMonth()];
    }

    /**
     * Renders the expense card
     * @return {object} JSX for the expense card
     */
    render() {
        return (
            <div>
                <Jumbotron className="smallerjumb">
                    <Container >
                        <Row>
                            <Col xs="1">
                                <div className="calendar-icon
                                    calendar-icon--single">
                                    <div className="calendar-icon__day">
                                        {this.getDay()}
                                    </div>
                                    <div className="calendar-icon__month">
                                        {this.getMonth()}
                                    </div>
                                </div>
                            </Col>
                            <Col xs="7" className='centerVerticalLeft'>
                                <div className="leftAlignText" style={{}}>
                                    <h5>{this.props.name}</h5>
                                    <div className="leftAlignText">
                                    </div>
                                    {'Total: '}
                                    <strong>
                                        {currencies[this.props.currency].symbol}
                                        {' '}
                                        {centsToString(this.props.totalCost)}
                                    </strong>
                                </div>
                                <div className="leftAlignText">
                                    {this.props.userOwe < 0
                                            ? 'Owe: '
                                            : 'Owed: '}
                                    <strong>
                                        <font
                                            color={this.props.userOwe < 0
                                                    ? 'red'
                                                    : 'green'}
                                        >
                                            {currencies[this.props.currency]
                                                    .symbol}
                                            {' '}
                                            {centsToString(
                                                Math.abs(this.props.userOwe)
                                            )}
                                        </font>
                                    </strong>
                                </div>
                            </Col>
                            <Col xs="1" className='centerVertical'>
                                <EditExpenseModal
                                    updateParent={this.updateParent}
                                    expenseReference={
                                        this.props.expenseReference
                                    }
                                />
                            </Col>
                        </Row>
                    </Container>
                </Jumbotron>
            </div>
        );
    }
}

ExpenseCard.propTypes = {
    date: PropTypes.object,
    name: PropTypes.string,
    currency: PropTypes.string,
    totalCost: PropTypes.number,
    userOwe: PropTypes.number,
    expenseReference: PropTypes.object,
};

export default Expenses;
