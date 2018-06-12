import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {auth} from '../../Firebase/fire';
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

import AuthContext from '../../Session/AuthContext';

const NavigationNonAuth = (props) => (
    <Nav className="ml-auto" navbar>
        <NavItem>
            <NavLink
                onClick={props.close}
                tag={Link}
                to="/signin"
            >
                Sign in
            </NavLink>
        </NavItem>
    </Nav>
);

NavigationNonAuth.propTypes = {
    close: PropTypes.func,
};

const NavigationAuth = (props) => (
    <Nav className="ml-auto" navbar>
        <NavItem>
            <NavLink
                onClick={props.close}
                tag={Link}
                to="/expenses"
            >
                Expenses
            </NavLink>
        </NavItem>
        <NavItem>
            <NavLink
                onClick={props.close}
                tag={Link}
                to="/groups"
            >
                Groups
            </NavLink>
        </NavItem>
        <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
                {auth.currentUser ? auth.currentUser.displayName : null}
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
                        onClick={() => {
                            auth.signOut();
                            props.close();
                        }}
                    >
                        Sign out
                    </NavLink>
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    </Nav>
);

NavigationAuth.propTypes = {
    close: PropTypes.func,
};

const Navigation = (props) => (
    <AuthContext.Consumer>
        {(authUser) => (
            authUser
                ? <NavigationAuth {...props}/>
                : <NavigationNonAuth {...props}/>
        )}
    </AuthContext.Consumer>
);

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
        this.state = {};
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.closeNavbar = this.closeNavbar.bind(this);
    }

    /** Opens/closes navbar */
    toggleNavbar() {
        this.setState({
            isOpen: !this.state.isOpen,
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
                            <Navigation close={this.closeNavbar}/>
                        </Collapse>
                    </div>
                </Navbar>
                <div style={{paddingTop: '3.8em'}}/>
            </div>
        );
    }
}

export default Header;
