import React from 'react'
import { Link } from 'react-router-dom'

// The Header creates links that can be used to navigate
// between routes.

class Header extends React.Component {
  render() {
    return (
      <div className="App-header">
        <nav>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/about'>About</Link></li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Header;
