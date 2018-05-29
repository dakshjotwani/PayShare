class EqualOpt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        for (var i = 0; i < this.props.users.length; i++) {
            this.state[i] = "success";
        }
    }

    componentDidMount() {
        for (var i = 0; i < this.props.users.length; i++) {
            var key = this.props.users[i] + i;
            this.setState({[key]: "success"})
        }
    }
    updateExpenseCosts = (owesList) => {
        let usersObj = {...this.props.splitUsersObj} 
        Object.keys(usersObj).forEach(function(key, index) {
            usersObj[key].userOwe = 0
            usersObj[key].userCost = 0
        })
        for (let i = 0; i < owesList.length; i++) {
            let userEmail = owesList[i][0]
            let owePrice  = owesList[i][1]
            usersObj[userEmail].userOwe = owePrice
            console.log(userEmail, owePrice)
        }
        this.props.updateExpenseCosts(usersObj)
        // Send to parent
    }

    splitEqual() {
        // Work with smallest denomination. Makes life easier.
        let payer = this.props.payerEmail;
        let users = this.props.splitUsersObj;
        let numUsers = Object.keys(users).length;
        let totalCost = Math.trunc(this.props.totalAmount * 100);
        let splitCost = Math.trunc(totalCost / numUsers);
        let cents = totalCost - (splitCost * numUsers);
        users[payer].userOwe = 0;
        console.log(totalCost, splitCost, cents);
        
        // Cleanup previous values
        for (let email in users) {
            users[email].userCost = 0;
            users[email].userOwe = 0;
        }
        
        // assign splitCost to everyone in dollars
        for (let email in users) {
            let cost = splitCost / 100;
            users[email].userCost = cost;
            if (email !== payer) {
                users[email].userOwe = -1 * cost;
                users[payer].userOwe += cost;
            }
        }
        
        // assign cents. TODO: Shuffle object keys to randomize
        while (cents > 0) {
            for (let email in users) {
                users[email].userCost += 0.01;
                cents--;
                if (email !== payer) {
                    users[email].userOwe += -0.01;
                    users[payer].userOwe += 0.01;
                }
                if (cents <= 0) break;
            }
            if (cents <= 0) break;
        }
        console.log(users);
    }

    handleSubmit = () => {
        this.splitEqual();
        this.props.toggle();
    }
    
    handleChange  = (event) => {
        const name = event.currentTarget.getAttribute("name");
        let newVal;
        if (this.state[name] === undefined || this.state[name] === "success") {
            newVal = "notselected";
        } else {
            newVal = "success"
        }
        this.setState({
            [name]: newVal,
        });
    }

    render() {
        let numSelected = 0;
        for (var i = 0; i < this.props.users.length; i++) {
            var key = this.props.users[i] + i;
            if (this.state[key] === "success"
                || this.state[key] === undefined) {
                numSelected += 1;
            }
        }
        let UserList = this.props.users.map((user, index) => {
            if (this.state[user + index] === "success"
                || this.state[user + index] === undefined) {
                return (
                    <ListGroupItem
                        color="success"
                        key={index}
                        name={user + index}
                        onClick={this.handleChange}
                        action>
                        <div className="row justify-content-between">
                            <div className="col-4">
                                {user}
                            </div>
                            <div className="col-4">
                                {(parseFloat(this.props.totalAmount) / numSelected).toFixed(2)}
                            </div>
                        </div>
                    </ListGroupItem>
                );
            } else {
                return (
                    <ListGroupItem
                        color={this.state[user + index]}
                        key={index}
                        name={user + index}
                        onClick={this.handleChange} 
                        action>
                        <div className="row justify-content-between">
                            <div className="col-4">
                                {user}
                            </div>
                            <div className="col-4">
                                {(0).toFixed(2)}
                            </div>
                        </div>
                    </ListGroupItem>
                );
            }
        });
        return (
            <div>
                <Modal
                    isOpen={this.props.modal}
                    toggle={this.props.toggle}
                    className={this.props.className}>
                    <ModalHeader
                        toggle={this.props.toggle}>
                        Split Equally
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup check>
                            {UserList}
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
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
