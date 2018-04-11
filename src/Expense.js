import React, { Component } from 'react';

class Expense extends Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }
    render() {
        return (
            <div className="Expense">
                <p> {this.state.date.toLocaleDateString()} </p>
            </div>
        );
    }
}

export default Expense;