import React from 'react';
import {
    ListGroupItem, UncontrolledTooltip,
    Button, Badge
} from 'reactstrap';

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
            >
                <div className="row justify-content-between">
                    <div className="col-6">
                        <Button
                            color="link"
                            key={this.props.item.index}
                            name={this.props.item.index}
                            onClick={this.props.onClick}
                            style={{whiteSpace: 'normal',
                                color: 'black',
                                textDecoration: 'none'
                            }}
                        >
                            {this.props.item.name}
                        </Button>
                    </div>
                    <div className="col-1">
                        <Button id={"usersTooltip-" + this.props.id} color="link">
                            <Badge color="secondary" pill>{names.length}</Badge>
                        </Button>
                        <UncontrolledTooltip
                            placement="top"
                            target={"usersTooltip-" + this.props.id}
                        >
                            {names.join() !== ""
                                ? names.join(", ")
                                : "Nobody has selected this item."}
                        </UncontrolledTooltip>
                    </div>
                    <div className="col-2">
                        <Button
                            color="link"
                            key={this.props.item.index}
                            name={this.props.item.index}
                            onClick={this.props.onClick}
                            style={{whiteSpace: 'normal',
                                color: 'black',
                                textDecoration: 'none'
                            }}
                        >
                            {parseFloat(this.props.item.price).toFixed(2)}
                        </Button>
                    </div>
                    <div className="col-2">
                        <Button
                            color="link"
                            style={{
                                float: 'right',
                                textDecoration: 'none',
                                color: this.props.item.users.hasOwnProperty(
                                    this.props.currentUser
                                ) ? "green" : "red"
                            }}
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
