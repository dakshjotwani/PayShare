import React from 'react';
import { ListGroupItem, UncontrolledTooltip, Button } from 'reactstrap';
// Props:
// key = key
// item = this.state.items[key]
// currentUser = auth.currentUser.uid
// onClick = this.handleChange
// onClickRemove = this.handleRemoveItem

class Item extends React.Component {
    render() {
        let names = []

        for (let userKey in this.props.item.users) {
            let email = this.props.item.users[userKey];
            names.push(this.props.users[email].name);
        }

        return(
            <ListGroupItem
                color={
                    this.props.item.users.hasOwnProperty(this.props.currentUser)
                    ? "success" : undefined
                }
                key={this.props.item.index}
                name={this.props.item.index}
                onClick={this.props.onClick}
                action
            >
                <div className="row justify-content-between">
                    <div className="col-6">
                        {this.props.item.name}
                    </div>
                    <div className="col-2">
                        <Button id={"usersTooltip-" + this.props.id} color="link">
                            <i className="fas fa-users"></i>
                        </Button>
                        <UncontrolledTooltip
                            placement="top"
                            target={"usersTooltip-" + this.props.id}
                        >
                            {names.join()}
                        </UncontrolledTooltip>
                    </div>
                    <div className="col-2">
                        {parseFloat(this.props.item.price).toFixed(2)}
                    </div>
                    <div className="col-2">
                        <Button
                            color="danger"
                            size="sm"
                            style={{float: 'right'}}
                            name={this.props.item.index}
                            onClick={this.props.onClickRemove}
                        >
                            <i className="fas fa-times"></i>
                        </Button>
                    </div>
                </div>
            </ListGroupItem>
        )
    }
}

export default Item;
