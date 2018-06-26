import React from 'react';
import './Header.css';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {auth} from '../../Firebase/fire';
import {
    Button,
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
            <NavLink style={{color:'#f1f2eb'}}
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
    <Nav className="ml-auto" navbar color="faded">
        <NavItem>
            <NavLink id='expense' style={{color:'#f1f2eb'}}
                onClick={props.close}
                tag={Link}
                to="/expenses"
            >
                Expenses
            </NavLink>
        </NavItem>
        <NavItem>
            <NavLink style={{color:'#f1f2eb'}}
                onClick={props.close}
                tag={Link}
                to="/groups"
            >
                Groups
            </NavLink>
        </NavItem>
{/**
*This section covers the mobile version of the navbar
*/
}
	<div id='mobile-nav'>
            <NavLink id="links">
                    My Account
            </NavLink>
            <NavLink id="links">
                    Settings
	    </NavLink>
	    <Button outline color="danger" style={{margin:'0.5em 0 1em 0'}}
                    onClick={() => {
                        auth.signOut();
                        props.close();
                    }}
                >
                    Sign out
            </Button>{' '}
	</div>
{/**
*This section covers the desktop version of the navbar
*/
}
        <UncontrolledDropdown nav inNavbar id='desktop-nav'>
            <DropdownToggle nav caret style={{color:'#f1f2eb'}}>
                {auth.currentUser ? auth.currentUser.displayName : null}
            </DropdownToggle>
            <DropdownMenu right id='desktop-nav'>
                <DropdownItem>
                    My Account
                </DropdownItem>
                <DropdownItem>
                    Settings
                </DropdownItem>
               <DropdownItem divider />
                <DropdownItem
                    onClick={() => {
                        auth.signOut();
                        props.close();
                    }}
                >
                    Sign out
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
            <div class="nav">
                <Navbar className="navbar navbar-dark" fixed="top"  light expand="md"
		style={{backgroundColor:'#1c1f33'}}>
                    <div className="container">
                        <NavbarBrand style={{color:'#f1f2eb'}}
                            onClick={this.closeNavbar}
                            tag={Link}
                            to="/"
                        >
                            PayShare
                        </NavbarBrand>
                        <NavbarToggler onClick={this.toggleNavbar} />
                        <Collapse isOpen={this.state.isOpen} navbar >
                            <Navigation close={this.closeNavbar}/>
                        </Collapse>
                    </div>
                </Navbar>
            </div>
        );
    }
}

export default Header;
