import React, { Component } from 'react';
import firebase from './fire';
import Header from './Header'
import Footer from './Footer'
import Expenses from './Expenses'
import './App.css';
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
      <Router>
        <div className="App">
          <Header />
          <Route exact path='/' component={Home} />
          <Route path='/expenses' component={Expenses} />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
