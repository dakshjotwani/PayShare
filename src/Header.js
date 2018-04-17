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
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.closeNavbar = this.closeNavbar.bind(this);
  }

  toggleNavbar() {
    this.setState({
       isOpen: !this.state.isOpen
    });
  }

  closeNavbar() {
    this.setState({isOpen: false});
  }

  render() {
    return (
      <div>
        <Navbar fixed="top" color="light" light expand="md">
        <div className="container">
          <NavbarBrand onClick={this.closeNavbar} tag={Link} to="/">PayShare</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink onClick={this.closeNavbar} tag={Link} to="/expenses">Expenses</NavLink>
              </NavItem>
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
        </div>
        </Navbar>
        <div style={{paddingTop: '60px'}}/>
      </div>
    );
  }
}

export default Header;
