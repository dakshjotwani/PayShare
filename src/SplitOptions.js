import React from 'react'
import './Expenses.css'
import {splitEqual, splitUnequal} from './algs2.js'
import ByItemOpt from './ByItemOpt'
import {
    Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter,
    FormGroup, FormText,
    Container, Row, Col
} from 'reactstrap';

class UnequalOpt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: {}
        }
    }
    
    handleChange = (event) => {
        // work with cents to avoid epsilon errors
        const target = event.target;
        const email = target.name;
        let update = this.state.entries;
        update[email] = Math.trunc(parseFloat(target.value) * 100);
        if (isNaN(update[email])) update[email] = 0;

        this.setState({
            entries: update,
        });
    }

    handleSubmit = () => {
        let users = splitUnequal(this.props.splitUsersObj,
                                    this.state.entries,
                                    this.props.payerEmail);
        this.props.updateSplitType("unequal");
        this.props.updateExpenseCosts(users);
        this.setState({entries: {}}); // reset modal
        this.props.toggle();
    }

    render() {
        // TODO retain values
        let nameBoxes = [];
        let left = Math.trunc(this.props.totalAmount * 100);
        for (let email in this.state.entries) {
            left -= this.state.entries[email];
        }
        left /= 100;
        let submitCheck = left !== 0;
        for (let email in this.props.splitUsersObj) {
            nameBoxes.push(
                <div key={email}>
                <Container>
                    <Row>
                        <Col className="centerVertical">
                            {this.props.splitUsersObj[email].name}
                        </Col>
                        <Col>
                            <div
                                className="input-group"
                                style={{padding: '0.25em'}}>
                                <div className="input-group-prepend">
                                    <span
                                        className="input-group-text"
                                        id="inputGroupPrepend2">
                                        $
                                    </span>
                                </div>
                                <input type="number"
                                    name={email}
                                    onChange={this.handleChange}
                                    className="form-control"
                                    id="totalAmount"
                                    placeholder="0.00"
                                    required>
                                </input>
                            </div>
                        </Col>
                    </Row>
                </Container>
                </div>
            );
        }
        return (
        <div>
        <Modal
            isOpen={this.props.modal}
            toggle={this.props.toggle}
            className={this.props.className}>
            <ModalHeader
                toggle={this.props.toggle}>
                Split Unequally
            </ModalHeader>
            <ModalBody>
                <FormGroup onSubmit={this.handleSubmit}>
                    {nameBoxes}
                </FormGroup>
                <FormText className="text-center">
                    {left} left
                </FormText>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="primary"
                    disabled = {submitCheck}
                    onClick={this.handleSubmit}>
                    Save
                </Button>{' '}
                <Button
                    color="secondary"
                    onClick={this.props.toggle}>
                    Cancel
                </Button>
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
            eqButton: false,
            neButton: false,
            itButton: false
        }
        this.splitEqual = this.splitEq.bind(this);
        this.toggleUnequalModal = this.toggleUnequalModal.bind(this);
        this.toggleByItemModal = this.toggleByItemModal.bind(this);
    }

    toggleUnequalModal() {
        this.setState({
            unequalModal: !this.state.unequalModal
        });
    }

    setSplitType(type) {
        this.setState({
            eqButton: type === "equal",
            neButton: type === "unequal",
            itButtom: type === "item"
        });
        this.props.updateSplitType(type);
    }

    splitEq() {
        let users = splitEqual(this.props.splitUsersObj,
                        this.props.payerEmail,
                        this.props.totalAmount);
        this.props.updateExpenseCosts(users);
        this.setSplitType("equal");
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
            <div>
                <ButtonGroup>
                    <Button 
                        outline
                        active={this.state.eqButton}
                        onClick={this.splitEqual}
                        color="primary">
                        Equally
                    </Button>
                    <UnequalOpt
                        {...this.props}
                        updateExpenseCosts={this.props.updateExpenseCosts}
                        updateSplitType={this.setSplitType.bind(this)}
                        totalAmount={this.props.totalAmount}
                        users={this.props.users}
                        modal={this.state.unequalModal}
                        toggle={this.toggleUnequalModal} />
                    <Button
                        outline
                        active={this.state.neButton}
                        onClick={this.toggleUnequalModal}
                        color="primary">
                        Unequally
                    </Button>
                    {this.props.expenseReference !== undefined &&
                        <ByItemOpt 
                            {...this.props}
                            updateExpenseCosts={this.props.updateExpenseCosts}
                            items={this.props.items}
                            totalAmount={this.props.totalAmount}
                            users={this.props.users}
                            modal={this.state.byItemModal}
                            toggle={this.toggleByItemModal} />}
                    {this.props.expenseReference !== undefined &&
                        <Button
                            outline
                            onClick={this.toggleByItemModal}
                            color="primary">
                            By Item
                        </Button>}
                </ButtonGroup>
            </div>
        );
    }
}
export default SplitOptions;
