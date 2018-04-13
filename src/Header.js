import React from 'react'
import { Link } from 'react-router-dom'
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
  DropdownItem
} from 'reactstrap';

// The Header creates links that can be used to navigate
// between routes.

class Header extends React.Component {
  constructor(props) {
    super(props);
    // TODO: Switch to using react context
    this.state = { name: "Name" }
  }

  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand tag={Link} to="/">PayShare</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="/about">About</NavLink>
              </NavItem>
              {/*
              <NavItem>
                <NavLink >GitHub</NavLink>
              </NavItem>
              */}
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  {this.state.name}
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
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Header;
