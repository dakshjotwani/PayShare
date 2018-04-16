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

class Expenses extends React.Component {
    render() {
        return (
            <div>
                <div style={{ paddingTop: '1em' }}></div>
                <ListGroup>
                    <ExpenseCard />
                    <ExpenseCard />
                    <ExpenseCard />
                </ListGroup>
            </div>
        );
    }
}