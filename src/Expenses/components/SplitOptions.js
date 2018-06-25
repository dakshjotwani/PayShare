import React from 'react';
import PropTypes from 'prop-types';
import '../index.css';
import ByItemOpt from './ByItemOpt';

import {
    Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter,
    FormGroup, FormText,
    Container, Row, Col,
} from 'reactstrap';

import {
    splitEqual,
    splitUnequal,
    stringToCents,
    centsToString,
} from '../../utils/algs2.js';

import * as currencies from '../../utils/json/currencies.json';

/** Modal to specify split for unequal split option */
class UnequalOpt extends React.Component {
    /**
     * @constructor
     * @param {object} props passed down by parent
     */
    constructor(props) {
        super(props);
        this.state = {
            entries: {},
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * store users' cost values on number field change
     * @param {object} event that invoked the method
     */
    handleChange(event) {
        // work with cents to avoid float/double precision errors
        const target = event.target;
        const email = target.name;
        let update = this.state.entries;
        update[email] = stringToCents(target.value);
        if (isNaN(update[email])) update[email] = 0;

        this.setState({
            entries: update,
        });
    }

    /** Assigns updated cost values to users and sends it back to parent */
    handleSubmit() {
        let users = splitUnequal(this.props.splitUsersObj,
                                    this.state.entries,
                                    this.props.payerEmail);
        this.props.updateSplitType('unequal');
        this.props.updateExpenseCosts(users);
        this.setState({entries: {}}); // reset modal
        this.props.toggle();
    }

    /**
     * Renders modal to specify values for unequal split
     * @return {object} Unequal split modal
     */
    render() {
        // TODO retain values
        let nameBoxes = [];
        let left = stringToCents(this.props.totalAmount);
        for (let email in this.state.entries) {
            if (this.state.entries.hasOwnProperty(email)) {
                left -= this.state.entries[email];
            }
        }
        left = left >= 0 ? centsToString(left) : '-' + centsToString(-1 * left);
        let submitCheck = left !== '0.00';
        for (let email in this.props.splitUsersObj) {
            if (!this.props.splitUsersObj.hasOwnProperty(email)) continue;
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
                                        {currencies[
                                            this.props.currency
                                        ].symbol}
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
                    {currencies[this.props.currency].symbol} {left} left
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

UnequalOpt.propTypes = {
    splitUsersObj: PropTypes.object,
    payerEmail: PropTypes.string,
    updateSplitType: PropTypes.func,
    updateExpenseCosts: PropTypes.func,
    toggle: PropTypes.func,
    totalAmount: PropTypes.string,
    currency: PropTypes.string,
    modal: PropTypes.bool,
    className: PropTypes.string,
};

/** ButtonGroup that links all split options together */
class SplitOptions extends React.Component {
    /**
     * @constructor
     * @param {object} props passed down by parent
     */
    constructor(props) {
        super(props);
        this.state = {
            equalModal: false,
            unequalModal: false,
            byItemModal: false,
        };
        this.toggleUnequalModal = this.toggleUnequalModal.bind(this);
        this.setSplitType = this.setSplitType.bind(this);
        this.splitEqual = this.splitEq.bind(this);
        this.toggleByItemModal = this.toggleByItemModal.bind(this);
    }

    /** Opens/Closes UnequalOpt modal */
    toggleUnequalModal() {
        this.setState({
            unequalModal: !this.state.unequalModal,
        });
    }

    /**
     * Sends split type information to parent
     * @param {string} type one of 'equal', 'unequal', 'item'
     */
    setSplitType(type) {
        this.props.updateSplitType(type);
    }

    /** Splits expense cost equally */
    splitEq() {
        let users = splitEqual(this.props.splitUsersObj,
                        this.props.payerEmail,
                        stringToCents(this.props.totalAmount),
                        true);
        this.props.updateExpenseCosts(users);
        this.setSplitType('equal');
    }

    /** Opens/closes ByItemOpt modal */
    toggleByItemModal() {
        // If it was just opened
        if (this.state.byItemModal === false) {
            this.setState({
                itemsave: this.state,
                byItemModal: true,
            });
        } else {
            // If closing without changes
            this.setState(this.state.itemsave);
            this.setState({byItemModal: false});
        }
    }

    /**
     * Renders SplitOptions ButtonGroup for users to select
     * a split type.
     * @return {object} Split options
     */
    render() {
        return (
            <div>
                <ButtonGroup>
                    <Button
                        outline
                        disabled={this.props.isActive}
                        active={this.props.splitType === 'equal'}
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
                        currency={this.props.currency}
                        modal={this.state.unequalModal}
                        toggle={this.toggleUnequalModal} />
                    <Button
                        outline
                        disabled={this.props.isActive}
                        active={this.props.splitType === 'unequal'}
                        onClick={this.toggleUnequalModal}
                        color="primary">
                        Unequally
                    </Button>
                    {this.props.expenseReference !== undefined &&
                        <ByItemOpt
                            {...this.props}
                            updateExpenseCosts={this.props.updateExpenseCosts}
                            updateSplitType={this.setSplitType.bind(this)}
                            items={this.props.items}
                            currency={this.props.currency}
                            totalAmount={this.props.totalAmount}
                            users={this.props.users}
                            modal={this.state.byItemModal}
                            toggle={this.toggleByItemModal} />}
                    {this.props.expenseReference !== undefined &&
                        <Button
                            outline
                            disabled={this.props.isActive}
                            active={this.props.splitType === 'item'}
                            onClick={this.toggleByItemModal}
                            color="primary">
                            By Item
                        </Button>}
                </ButtonGroup>
            </div>
        );
    }
}

SplitOptions.propTypes = {
    updateSplitType: PropTypes.func,
    splitUsersObj: PropTypes.object,
    payerEmail: PropTypes.string,
    totalAmount: PropTypes.string,
    updateExpenseCosts: PropTypes.func,
    isActive: PropTypes.bool,
    splitType: PropTypes.string,
    users: PropTypes.array,
    currency: PropTypes.string,
    expenseReference: PropTypes.object,
    items: PropTypes.array,
};

export default SplitOptions;
