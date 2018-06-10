import React, {Component} from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Expenses from '../Expenses/index';
import SignIn from '../SignIn/index';
import Landing from '../Landing/index';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import authenticate from '../Session/authenticate';

/** @override React App Component which houses the router */
class App extends Component {
    /**
     * Renders root/base path and sets up Router
     * @return {object} JSX for app
     */
    render() {
        return (
            <MuiThemeProvider>
                <Router>
                    <div className="App">
                        <Header />
                        <Route exact path='/' component={Landing} />
                        <Route exact path='/expenses' component={Expenses} />
                        <Route exact path='/signin' component={SignIn} />
                        <Footer />
                    </div>
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default authenticate(App);
