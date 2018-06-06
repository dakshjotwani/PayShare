import React from 'react';
import PropTypes from 'prop-types';
import {
    ListGroupItem, Popover, PopoverBody,
    Button, Badge,
} from 'reactstrap';

/**
 * Item class for each each item in list of items
 * for 'Split by item' option
 */
class Item extends React.Component {
    /**
     * @constructor
     * @param {object} props passed down by parent
     */
    constructor(props) {
        super(props);

        this.toggleUsersPopover = this.toggleUsersPopover.bind(this);
        this.state = {
            usersPopoverOpen: false,
        };
    }

    /**
     * Toggle for popover that displays users that are paying for
     * the item
     */
    toggleUsersPopover() {
        this.setState({
            usersPopoverOpen: !this.state.usersPopoverOpen,
        });
    }

    /**
     * Renders the item as a reactstrap ListGroupItem
     * @return {object} Item
     */
    render() {
        let names = [];
        for (let userKey in this.props.item.users) {
            if (this.props.item.users.hasOwnProperty(userKey)) {
                let email = this.props.item.users[userKey];
                names.push(this.props.users[email].name);
            }
        }

        return (
            <ListGroupItem
                color={
                    this.props.item.users
                        .hasOwnProperty(this.props.currentUser)
                    ? 'success' : undefined
                }
                key={this.props.item.index}
                name={this.props.item.index}
            >
                <div className="row justify-content-between">
                    <div className="col-6" style={{padding: 0}}>
                        <Button
                            color="link"
                            key={this.props.item.index}
                            name={this.props.item.index}
                            onClick={this.props.onClick}
                            style={{whiteSpace: 'normal',
                                color: 'black',
                                textDecoration: 'none',
                            }}
                            block
                        >
                            {this.props.item.name}
                        </Button>
                    </div>
                    <div className="col-1" style={{padding: 0}}>
                        <Button
                            color="link"
                            id={'usersTooltip-' + this.props.id}
                            onClick={this.toggleUsersPopover}
                            block
                        >
                            <Badge color="secondary" pill>{names.length}</Badge>
                        </Button>
                        <Popover
                            placement="top"
                            target={'usersTooltip-' + this.props.id}
                            isOpen={this.state.usersPopoverOpen}
                            toggle={this.toggleUsersPopover}
                        >
                            <PopoverBody>
                                {names.join() !== ''
                                        ? names.join(', ')
                                        : 'Nobody has selected this item.'}
                            </PopoverBody>
                        </Popover>
                    </div>
                    <div className="col-2" style={{padding: 0}}>
                        <Button
                            color="link"
                            key={this.props.item.index}
                            name={this.props.item.index}
                            onClick={this.props.onClick}
                            style={{whiteSpace: 'normal',
                                color: 'black',
                                textDecoration: 'none',
                            }}
                            block
                        >
                            {parseFloat(this.props.item.price).toFixed(2)}
                        </Button>
                    </div>
                    <div className="col-1" style={{padding: 0}}>
                        <Button
                            color="link"
                            style={{
                                float: 'right',
                                textDecoration: 'none',
                                color: this.props.item.users.hasOwnProperty(
                                    this.props.currentUser
                                ) ? 'green' : 'red',
                            }}
                            name={this.props.item.index}
                            onClick={this.props.onClickRemove}
                        >
                            <i className="fas fa-times"></i>
                        </Button>
                    </div>
                </div>
            </ListGroupItem>
        );
    }
}

Item.propTypes = {
    item: PropTypes.object,
    users: PropTypes.object,
    currentUser: PropTypes.string,
    onClick: PropTypes.func,
    id: PropTypes.number,
    onClickRemove: PropTypes.func,
};

export default Item;
