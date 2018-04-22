import React, { Component } from 'react';
import {firebase, auth} from './fire';
import Header from './Header'
import Footer from './Footer'
import Expenses from './Expenses'
import SignIn from './SignIn'
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {
    BrowserRouter as Router,
    Route,
    Redirect
} from 'react-router-dom'

const Home = () => (
    <div>
        <h2>Home</h2>
    </div>
)

function PrivateRoute ({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authed
                ? <Component authed={authed} {...props} />
                : <Redirect to='/signin' />}
            />
    )
}

function PublicRoute ({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => !authed
                ? <Component authed={authed} {...props} />
                : <Redirect to='/expenses' />}
            />
    )
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authed: null,
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            user
                ? this.setState({authed: user})
                : this.setState({authed: null});
        });
    }

    render() {
        let {authed} = this.state;
        return (
            <MuiThemeProvider>
                <Router>
                    <div className="App">
                        <Header authed={authed} />
                        <Route exact path='/' component={Home} />
                        <PrivateRoute authed={authed} path='/expenses' component={Expenses} />
                        <PublicRoute authed={authed} path='/signin' component={SignIn} />
                        <Footer />
                    </div>
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default App;
