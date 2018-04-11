import React from 'react'
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import { Link } from 'react-router-dom'

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
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to='/'>PayShare</Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem componentClass={Link} eventKey={1} href="/" to="/">
            Home
    </NavItem>
          <NavItem componentClass={Link} eventKey={2} href="/about" to="/about">
            About
    </NavItem>
        </Nav>
        <Nav pullRight>
          <NavDropdown eventKey={3} title={this.state.name} id="basic-nav-dropdown">
            <MenuItem eventKey={3.1}>Action</MenuItem>
            <MenuItem eventKey={3.2}>Another action</MenuItem>
            <MenuItem eventKey={3.3}>Something else here</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3.4}>Separated link</MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar>
    );
  }
}

export default Header;
