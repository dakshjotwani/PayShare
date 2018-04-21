import React, { Component } from 'react';
import {fire, auth} from './fire';
import Header from './Header'
import Footer from './Footer'
import Expenses from './Expenses'
import SignIn from './SignIn'
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
      <Router>
        <div className="App">
          <Header />
          <Route exact path='/' component={Home} />
          <Route path='/expenses' component={Expenses} />
          <Route path='/signin' component={SignIn} />
          <Footer />
        </div>
      </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
