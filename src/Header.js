import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {auth} from './fire';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';


/**
 * Header creates links that can be used to navigate
 * between routes.
 */
class Header extends React.Component {
    /**
     * @constructor
     * @param {object} props passed down by parent
     */
    constructor(props) {
        super(props);
        // TODO: Switch to using react context
        this.state = {name: 'Name'};
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.closeNavbar = this.closeNavbar.bind(this);
    }

    /** Opens/closes navbar */
    toggleNavbar() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    /** Signs user out */
    signOut() {
        auth.signOut();
        this.setState({
            authed: null,
        });
    }

    /** Closes navbar */
    closeNavbar() {
        this.setState({isOpen: false});
    }

    /**
     * Renders navbar
     * @return {object} rendered navbar
     */
    render() {
        let {authed} = this.props;
        let navItems = (
            <Nav className="ml-auto" navbar>
                <NavItem>
                    <NavLink
                        onClick={this.closeNavbar}
                        tag={Link}
                        to="/signin"
                    >
                        Sign in
                    </NavLink>
                </NavItem>
            </Nav>
        );
        if (authed) {
            navItems = (
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <NavLink
                            onClick={this.closeNavbar}
                            tag={Link}
                            to="/expenses"
                        >
                            Expenses
                        </NavLink>
                    </NavItem>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            {authed.displayName}
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>
                                My Account
                            </DropdownItem>
                            <DropdownItem>
                                Settings
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>
                                <NavLink
                                    onClick={this.signOut.bind(this)}
                                    tag={Link}
                                    to="/"
                                >
                                    Sign out
                                </NavLink>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
            );
        }

        return (
            <div>
                <Navbar fixed="top" color="light" light expand="md">
                    <div className="container">
                        <NavbarBrand
                            onClick={this.closeNavbar}
                            tag={Link}
                            to="/"
                        >
                            PayShare
                        </NavbarBrand>
                        <NavbarToggler onClick={this.toggleNavbar} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                                {navItems}
                        </Collapse>
                    </div>
                </Navbar>
                <div style={{paddingTop: '60px'}}/>
            </div>
        );
    }
}

Header.propTypes = {
    authed: PropTypes.object,
};

export default Header;
