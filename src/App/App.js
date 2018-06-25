import React, {Component} from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import authenticate from '../Session/authenticate';

// Components to render pages for react-router-dom Routes
import Landing from '../Landing/index';
import SignIn from '../SignIn/index';
import Expenses from '../Expenses/index';
import Groups from '../Groups/index';

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
                        <Route exact path='/groups' component={Groups} />
                        <Footer />
                    </div>
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default authenticate(App);
