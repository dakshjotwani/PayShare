import React from 'react'
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Label, Input, FormGroup, Form,
    Container, Row, Col,
    ListGroup, ListGroupItem,
} from 'reactstrap';
import { firebase, auth, db } from './fire'
import { splitByItem } from './algs'
import ReceiptSelect from './ReceiptSelect'
class ByItemOpt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            selected: [],
            finalize: false,
            total: 0
        }
        this.handleChange = this.handleChange.bind(this);
        // Select All
        // if (this.props.items) {
        //     for (var i = 0; i < this.props.items.length; i++) {
        //         this.state[i] = "success";
        //     }
        // }
    }

    componentDidMount() {
        let self = this
        this.unsubscribe = this.props.expenseReference.collection('items')
        .onSnapshot(function(querySnapshot) {
            let items = {};
            let selected = [];
            let numItems = 0;
            let selByAtleastOne = 0;
            querySnapshot.forEach(function(doc) {
                let data = doc.data();
                selected[data.index] = data.users.hasOwnProperty(auth.currentUser.uid);
                let numSel = Object.keys(data.users).length;
                numItems++;
                if (numSel > 0) selByAtleastOne++;
                items[data.index] = {
                    itemId: doc.id,
                    name: data.name,
                    realPrice: data.price,
                    price: selected[data.index] ? (data.price / numSel) : (data.price / (numSel + 1)),
                    users: data.users
                }
            });
            self.setState({
                items: items,
                selected: selected,
                finalize: numItems === selByAtleastOne
            });
            console.log("items loaded")
        });
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    calculateTotal = () => {
        let sum = 0;
        for (let index in this.state.items) {
            if (this.state.selected[index] === true) {
                sum += parseFloat(this.state.items[index].price);
            }
        }
        return sum;
    }

    handleChange(event) {
        const name = parseInt(event.currentTarget.getAttribute("name"));
        let newVal;
        if (this.state.selected[name] === true) {
            newVal = false;
        } else {
            newVal = true;
        }
        let user = "users." + auth.currentUser.uid;
        this.props.expenseReference
            .collection('items')
            .doc(this.state.items[name].itemId)
            .update({
                [user]: newVal ? auth.currentUser.email : firebase.firestore.FieldValue.delete()
            }).then(() => {
                let tempSelected = this.state.selected.slice();
                tempSelected[name] = newVal;
                this.setState({
                    selected: tempSelected,
                });
            });
    }

    /*
    handleRemoveItem = (event) => {
        event.stopPropagation();
        const items = this.state.items.slice();
        items.splice(event.currentTarget.name, 1);
        this.setState({items: items});
    }    
    */

    handleSubmit = () => {
        // Overhead for Greg's code because I don't want to read it
        let tmpUsers = []
        let gregUsers = []
        let gregItems = []
        let gregCurrUser = auth.currentUser.email;
        for (let key in this.state.items) {
            let itemUsers = []
            for(let userKey in this.state.items[key].users) {
                if (tmpUsers.indexOf(this.state.items[key].users[userKey]) < 0) {
                    gregUsers.push([this.state.items[key].users[userKey], 0]);
                    tmpUsers.push(this.state.items[key].users[userKey]);
                }
                itemUsers.push(this.state.items[key].users[userKey]);
            }
            gregItems.push([this.state.items[key].name,
                                itemUsers,
                                parseFloat(this.state.items[key].realPrice)]);
        }
        console.log(splitByItem(gregUsers, gregItems, []));
        this.props.toggle();
        return;
        
        for (let index in this.state.items) {
            if (this.state.selected[index] === true
                && this.state.items[index].users.indexOf(auth.currentUser.email) < 0) {
                let updatedUsers = this.state.items[index].users.slice();
                updatedUsers.push(auth.currentUser.email);
                this.props.expenseReference
                    .collection('items')
                    .doc(this.state.items[index].itemId)
                    .update({
                         users: updatedUsers
                    });
            } else if (this.state.selected[index] == false
                && this.state.items[index].users.indexOf(auth.currentUser.email) >= 0) {
                let updatedUsers = this.state.items[index].users.slice();
                let toSplice = this.state.items[index].users.indexOf(auth.currentUser.email);
                updatedUsers.splice(toSplice, 1);
                this.props.expenseReference
                    .collection('items')
                    .doc(this.state.items[index].itemId)
                    .update({
                         users: updatedUsers
                    });
            }
        }
        this.props.toggle();
    }

    render() {
        const total = this.calculateTotal().toFixed(2);
        let finalizeButton;
        if (this.state.finalize) {
            finalizeButton = (
                <Button color="danger" onClick={this.handleSubmit}>Finalize</Button>
            );
        }
        let ItemList = Object.keys(this.state.items).map((key, index) => {
            let color = this.state.selected[index] ? "success" : undefined;
            return (
            <ListGroupItem color={color} key={index} name={index} onClick={this.handleChange} action>
                <div className="row justify-content-between">
                    <div className="col-8">
                        {this.state.items[key].name}
                    </div>
                    <div className="col-4">
                        {parseFloat(this.state.items[key].price).toFixed(2)}
                    </div>
                    {/*}
                    <div className="col-4">
                        <Button color="danger" size="sm" style={{float: 'right'}} name={index} onClick={this.handleRemoveItem}>
                            <span aria-hidden="true">&times;</span>
                        </Button>
    </div>
    */}
                </div>
            </ListGroupItem>
        )});
        return (
            <div>
                <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.props.toggle}>Split By Item</ModalHeader>
                    <ModalBody>
                        <FormGroup onSubmit={this.handleSubmit}>
                            <ListGroup>
                                {ItemList}
                            </ListGroup>
                        </FormGroup>
                        <Row>
                            <Col className='centerVertical' sm={{ size: 1, offset: 8}}>
                                    Total
                            </Col>
                            <Col sm={{ size: 4 }}>
                                <div className="input-group" >
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroupPrepend2">$</span>
                                    </div>
                                    <input type="number"
                                        readOnly
                                        disabled
                                        value={total}
                                        className="form-control" id="totalAmount" placeholder="0.00">
                                    </input>
                                </div>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <ReceiptSelect expenseReference={this.props.expenseReference} />
                        {finalizeButton}
                        <Button color="secondary" onClick={this.props.toggle}>Done</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default ByItemOpt;
