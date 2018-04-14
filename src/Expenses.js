import React from 'react'
import { Link } from 'react-router-dom'
import './Expenses.css';
import {
    ListGroup,
    Container,
    Row,
    Col,
    Jumbotron
} from 'reactstrap';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// The Header creates links that can be used to navigate
// between routes.
class Expenses extends React.Component {

    render() {
        return (
            <div>
                <div style={{paddingTop:'1em'}}></div>
                <ListGroup>
                    <ExpenseCard />
                    <ExpenseCard />
                    <ExpenseCard />
                </ListGroup>
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
        this.state = { name: "Name", monthName: monthName, day: day, storeName: this.props.storeName }
    }

    render() {
        return (
            <div>
                <Container >
                    <Jumbotron class="smallerjumb">
                        <Row>
                            <Col xs="2">
                                <div class="calendar-icon calendar-icon--single">
                                    <div class="calendar-icon__day">{this.state.day}</div>
                                    <div class="calendar-icon__month">{this.state.monthName}</div>
                                </div>
                            </Col>
                            <Col xs="2">
                            <img src="http://hernandoconnects.com/wp-content/uploads/2017/02/Icon-Placeholder.png" />
                            </Col>
                            <Col class="abscol">storeName</Col>
                            <Col>.col</Col>
                            <Col>.col</Col>
                        </Row>
                    </Jumbotron>
                </Container>
            </div>
        );
    }
}

export default Expenses;