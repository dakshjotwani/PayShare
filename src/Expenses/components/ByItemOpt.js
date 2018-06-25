import React from 'react';
import PropTypes from 'prop-types';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    FormGroup,
    Row, Col,
    ListGroup,
    Alert,
    Container,
} from 'reactstrap';
import {firebase, auth} from '../../Firebase/fire';
import {splitByItem, centsToString, stringToCents} from '../../utils/algs2.js';
import ReceiptSelect from './ReceiptSelect';
import Item from './Item';

import * as currencies from '../../utils/json/currencies.json';

/** @override Modal component to select and split by item */
class ByItemOpt extends React.Component {
    /**
     * @constructor
     * @param {object} props passed down by parent
     */
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            finalize: false,
            total: 0,
            realTotal: 0,
        };
        this.handleChange = this.handleChange.bind(this);
        this.calculateTotal = this.calculateTotal.bind(this);
        this.calculateTax = this.calculateTax.bind(this);
        this.handleRemoveItem = this.handleRemoveItem.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Subscribes to the expenses' items subcollection, and updates
     * state on change.
     */
    componentDidMount() {
        let self = this;
        this.unsubscribe = this.props.expenseReference.collection('items')
        .onSnapshot(function(querySnapshot) {
            let items = {};
            let numItems = 0;
            let selByAtleastOne = 0;
            let realTotal = 0;
            querySnapshot.forEach(function(doc) {
                let data = doc.data();
                let numSel = Object.keys(data.users).length;
                numItems++;
                realTotal += data.price;
                if (numSel > 0) selByAtleastOne++;
                items[data.index] = {
                    index: data.index,
                    itemId: doc.id,
                    name: data.name,
                    realPrice: data.price,
                    price: data.users.hasOwnProperty(auth.currentUser.uid)
                            ? Math.floor(data.price / numSel)
                            : Math.floor(data.price / (numSel + 1)),
                    users: data.users,
                };
            });
            self.setState({
                items: items,
                finalize: numItems === selByAtleastOne & numItems !== 0,
                realTotal: realTotal,
            });
        });
    }

    /** Unsubscribe to the expenses' items subcollection when unmounted */
    componentWillUnmount() {
        this.unsubscribe();
    }

    /**
     * Computes estimated cost for user during selection
     * @return {number} estimated total
     */
    calculateTotal() {
        let sum = 0;
        let items = this.state.items;
        for (let index in items) {
            if (items[index].users.hasOwnProperty(auth.currentUser.uid)) {
                sum += this.state.items[index].price;
            }
        }
        return sum;
    }

    /**
     * Computes estimated tax for user during selection
     * @param {number} userTotal estimated user cost
     * @return {number} estimated tax
     */
    calculateTax(userTotal) {
        let subtotal = this.state.realTotal;
        let total = stringToCents(this.props.totalAmount);
        return Math.floor((userTotal / subtotal) * (total - subtotal));
    }

    /**
     * Updates firestore document of item selected by user
     * @param {object} event (item) that invoked the method
     */
    handleChange(event) {
        const name = parseInt(event.currentTarget.getAttribute('name'), 10);
        let newVal;
        let items = this.state.items;
        if (items[name].users.hasOwnProperty(auth.currentUser.uid)) {
            newVal = false;
        } else {
            newVal = true;
        }
        let user = 'users.' + auth.currentUser.uid;
        this.props.expenseReference
            .collection('items')
            .doc(this.state.items[name].itemId)
            .update({
                [user]: newVal
                        ? auth.currentUser.email
                        : firebase.firestore.FieldValue.delete(),
            });
    }

    /**
     * Deletes item selected by user
     * @param {object} event (item delete button) that invoked the method
     */
    handleRemoveItem(event) {
        event.stopPropagation();
        let itemId = this.state.items[event.currentTarget.name].itemId;
        this.props.expenseReference.collection('items').doc(itemId).delete();
    }

    /**
     * Computes split, updates expense costs for each user and sends
     * it to the parent.
     */
    handleSubmit() {
        let usersObj = splitByItem(this.props.splitUsersObj,
            this.state.items,
            stringToCents(this.props.totalAmount),
            this.props.payerEmail);
        this.props.updateExpenseCosts(usersObj);
        this.props.updateSplitType('item');
        this.props.toggle();
    }

    /**
     * Renders split by item modal
     * @return {object} JSX for split by item modal
     */
    render() {
        const total = this.calculateTotal();
        const tax = this.calculateTax(total);
        let finalizeButton;
        if (this.props.payerEmail === auth.currentUser.email) {
            finalizeButton = (
                <Button
                    color="primary"
                    disabled={!this.state.finalize}
                    onClick={this.handleSubmit}>
                    Split
                </Button>
            );
        }
        let ItemList = Object.keys(this.state.items).map((key, index) => {
            return (
                <Item
                    key={key}
                    id={index}
                    item={this.state.items[key]}
                    users={this.props.splitUsersObj}
                    currentUser={auth.currentUser.uid}
                    onClick={this.handleChange}
                    onClickRemove={this.handleRemoveItem}
                />
            );
        });
        return (
            <div>
                <Modal
                    isOpen={this.props.modal}
                    toggle={this.props.toggle}
                    className={this.props.className}>
                    <ModalHeader
                        toggle={this.props.toggle}>
                        Split By Item
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup onSubmit={this.handleSubmit}>
                            <Alert
                                color='primary'
                                style={{textAlign: 'center'}}
                                isOpen={Object.keys(this.state.items)
                                        .length === 0}
                            >
                                Add items by clicking the
                                {' '}<i className="fas fa-camera"></i>{' '}
                                button below!
                            </Alert>
                            <ListGroup>
                                {ItemList}
                            </ListGroup>
                        </FormGroup>
                        <Container>
                        <Row style={{paddingBottom: '1em'}}>
                            <Col className='centerVertical'>
                                    Subtotal
                            </Col>
                            <Col>
                                <div className="input-group" >
                                    <div className="input-group-prepend">
                                        <span
                                            className="input-group-text"
                                            id="inputGroupPrepend2">
                                                {currencies[this.props.currency]
                                                        .symbol}
                                        </span>
                                    </div>
                                    <input type="number"
                                        readOnly
                                        disabled
                                        value={centsToString(total)}
                                        className="form-control"
                                        id="totalAmount"
                                        placeholder="0.00">
                                    </input>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='centerVertical'>
                                    Tax
                            </Col>
                            <Col>
                                <div className="input-group" >
                                    <div className="input-group-prepend">
                                        <span
                                            className="input-group-text"
                                            id="inputGroupPrepend2">
                                                {currencies[this.props.currency]
                                                        .symbol}
                                        </span>
                                    </div>
                                    <input type="number"
                                        readOnly
                                        disabled
                                        value={centsToString(tax)}
                                        className="form-control"
                                        id="totalAmount"
                                        placeholder="0.00">
                                    </input>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    </ModalBody>
                    <ModalFooter>
                        <ReceiptSelect
                            expenseReference={this.props.expenseReference} />
                        {finalizeButton}
                        <Button
                            color="secondary"
                            onClick={this.props.toggle}>
                            Done
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

ByItemOpt.propTypes = {
    expenseReference: PropTypes.object,
    splitUsersObj: PropTypes.object,
    totalAmount: PropTypes.string,
    payerEmail: PropTypes.string,
    updateExpenseCosts: PropTypes.func,
    updateSplitType: PropTypes.func,
    toggle: PropTypes.func,
    modal: PropTypes.bool,
    className: PropTypes.string,
    currency: PropTypes.string,
};

export default ByItemOpt;
