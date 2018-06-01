import React from 'react';
import {
    ListGroupItem, Popover, PopoverBody,
    Button, Badge
} from 'reactstrap';

class Item extends React.Component {
    constructor(props) {
        super(props);

        this.toggleUsersPopover = this.toggleUsersPopover.bind(this);
        this.state = {
            usersPopoverOpen: false
        }
    }

    toggleUsersPopover() {
        this.setState({
            usersPopoverOpen: !this.state.usersPopoverOpen
        });
    }

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
                    <div className="col-2">
                        <Button
                            id={"usersTooltip-" + this.props.id}
                            color="link"
                            onClick={this.toggleUsersPopover}
                        >
                            <Badge color="secondary" pill>{names.length}</Badge>
                        </Button>
                        <Popover
                            placement="top"
                            target={"usersTooltip-" + this.props.id}
                            isOpen={this.state.usersPopoverOpen}
                            toggle={this.toggleUsersPopover}
                        >
                            <PopoverBody>
                                {names.join() !== ""
                                        ? names.join(", ")
                                        : "Nobody has selected this item."}
                            </PopoverBody>
                        </Popover>
                    </div>
                    <div className="col-2">
                        <Button
                            color="link"
                            key={this.props.item.index}
                            name={this.props.item.index}
                            onClick={this.props.onClick}
                            style={{whiteSpace: 'normal',
                                color: 'black',
                                textDecoration: 'none',
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
