import React from 'react'
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    FormGroup,
    Row, Col,
    ListGroup, ListGroupItem,
    Tooltip
} from 'reactstrap';
import { firebase, auth } from './fire'
import { splitByItem } from './algs2.js'
import ReceiptSelect from './ReceiptSelect'

import * as currencies from './currencies.json';

class ByItemOpt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            finalize: false,
            total: 0
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        let self = this
        this.unsubscribe = this.props.expenseReference.collection('items')
        .onSnapshot(function(querySnapshot) {
            let items = {};
            let numItems = 0;
            let selByAtleastOne = 0;
            querySnapshot.forEach(function(doc) {
                let data = doc.data();
                let numSel = Object.keys(data.users).length;
                numItems++;
                if (numSel > 0) selByAtleastOne++;
                items[data.index] = {
                    index: data.index,
                    itemId: doc.id,
                    name: data.name,
                    realPrice: data.price,
                    price: data.users.hasOwnProperty(auth.currentUser.uid)
                            ? (data.price / numSel)
                            : (data.price / (numSel + 1)),
                    users: data.users
                }
            });
            self.setState({
                items: items,
                finalize: numItems === selByAtleastOne
            });
        });
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    calculateTotal = () => {
        let sum = 0;
        let items = this.state.items;
        for (let index in items) {
            if (items[index].users.hasOwnProperty(auth.currentUser.uid)) {
                sum += parseFloat(this.state.items[index].price);
            }
        }
        return sum;
    }

    handleChange(event) {
        const name = parseInt(event.currentTarget.getAttribute("name"));
        let newVal;
        let items = this.state.items;
        if (items[name].users.hasOwnProperty(auth.currentUser.uid)) {
            newVal = false;
        } else {
            newVal = true;
        }
        let user = "users." + auth.currentUser.uid;
        this.props.expenseReference
            .collection('items')
            .doc(this.state.items[name].itemId)
            .update({
                [user]: newVal 
                        ? auth.currentUser.email
                        : firebase.firestore.FieldValue.delete()
            }).then(() => {
            });
    }

    handleRemoveItem = (event) => {
        event.stopPropagation();
        let itemId = this.state.items[event.currentTarget.name].itemId;
        this.props.expenseReference.collection('items').doc(itemId).delete();
    }    

    handleSubmit = () => {
        let usersObj = splitByItem(this.props.splitUsersObj,
            this.state.items,
            this.props.payerEmail);
        this.props.updateExpenseCosts(usersObj);
        this.props.updateSplitType("item");
        this.props.toggle();
        return;
    }

    render() {
        const total = this.calculateTotal().toFixed(2);
        let finalizeButton;
        if (this.props.payerEmail === auth.currentUser.email) {
            finalizeButton = (
                <Button
                    color="danger"
                    disabled={!this.state.finalize}
                    onClick={this.handleSubmit}>
                    Finalize
                    </Button>
            );
        }
        let ItemList = Object.keys(this.state.items).map((key, index) => {
            let color = this.state.items[key]
                            .users
                            .hasOwnProperty(auth.currentUser.uid)
                        ? "success" 
                        : undefined;
            return (
            <ListGroupItem
                color={color}
                key={this.state.items[key].index}
                name={this.state.items[key].index}
                onClick={this.handleChange} action>
                <div className="row justify-content-between">
                    <div className="col-8">
                        {this.state.items[key].name}
                    </div>
                    <div className="col-2">
                        {parseFloat(this.state.items[key].price).toFixed(2)}
                    </div>
                    <div className="col-2">
                        <Button
                            color="danger"
                            size="sm"
                            style={{float: 'right'}}
                            name={this.state.items[key].index}
                            onClick={this.handleRemoveItem}>
                            <span aria-hidden="true">&times;</span>
                        </Button>
                    </div>
                </div>
            </ListGroupItem>
        )});
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
                            <ListGroup>
                                {ItemList}
                            </ListGroup>
                        </FormGroup>
                        <Row>
                            <Col
                                className='centerVertical'
                                sm={{ size: 1, offset: 8}}>
                                    Total
                            </Col>
                            <Col sm={{ size: 4 }}>
                                <div className="input-group" >
                                    <div className="input-group-prepend">
                                        <span
                                            className="input-group-text"
                                            id="inputGroupPrepend2">
                                            {
                                                currencies[this.props.currency]
                                                    ? currencies[this.props.currency]
                                                        .symbol
                                                    : currencies['USD'].symbol
                                            }
                                        </span>
                                    </div>
                                    <input type="number"
                                        readOnly
                                        disabled
                                        value={total}
                                        className="form-control"
                                        id="totalAmount"
                                        placeholder="0.00">
                                    </input>
                                </div>
                            </Col>
                        </Row>
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

export default ByItemOpt;
