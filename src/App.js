import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {auth, db} from './fire';
import Header from './Header';
import Footer from './Footer';
import Expenses from './Expenses';
import SignIn from './SignIn';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
} from 'react-router-dom';
import {Jumbotron, Button} from 'reactstrap';

const Home = () => (
    <div>
        <Jumbotron>
            <h1 className="display-3">PayShare</h1>
            <p className="lead">
                This is a simple hero unit, a simple Jumbotron-style
                component for calling extra attention to featured content
                or information.
            </p>
            <hr className="my-2" />
            <p>
                It uses utility classes for typgraphy and spacing to space
                content out within the larger container.
            </p>
            <p className="lead">
                <Button color="primary">Learn More</Button>
            </p>
        </Jumbotron>
    </div>
);

/**
 * Wrapper for Route react component to reroute unauthorized
 * users to /signin instead
 * @param {object} props for Route component
 * @return {object} JSX for PrivateRoute
 */
function PrivateRoute({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
        render={(props) => authed
            ? <Component authed={authed} {...props} />
            : <Redirect to='/signin' />}
        />
    );
}

PrivateRoute.propTypes = {
    component: PropTypes.any, // component is undefined on change
    authed: PropTypes.object,
};

/**
 * Wrapper for Route react component to reroute authorized users
 * to /expenses
 * @param {object} props for Route component
 * @return {object} JSX for PublicRoute
 */
function PublicRoute({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => !authed
            ? <Component authed={authed} {...props} />
                : <Redirect to='/expenses' />}
            />
    );
}

PublicRoute.propTypes = {
    component: PropTypes.any, // component is undefined on change
    authed: PropTypes.object,
};

/** @override React App Component which houses the router */
class App extends Component {
    /**
     * @constructor
     * @param {object} props passed down by parent
     */
    constructor(props) {
        super(props);
        this.state = {
            authed: null,
        };
    }

    /** Initializes auth listener on component mount */
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                db.collection('users').doc(user.email).get()
                    .then((doc) => {
                        if (!doc.exists) {
                            let data = {
                                name: user.displayName,
                                email: user.email,
                                uid: user.uid,
                            };
                            db.collection('users').doc(user.email).set(data);
                        }
                    });
                this.setState({authed: user});
            } else {
                this.setState({authed: null});
            }
        });
    }

    /**
     * Renders root/base path and sets up Router
     * @return {object} JSX for app
     */
    render() {
        return (
            <MuiThemeProvider>
                <Router>
                    <div className="App">
                        <Header authed={this.state.authed} />
                        <Route exact path='/' component={Home} />
                        <PrivateRoute
                            authed={this.state.authed}
                            path='/expenses'
                            component={Expenses}
                        />
                        <PublicRoute
                            authed={this.state.authed}
                            path='/signin'
                            component={SignIn}
                        />
                        <Footer />
                    </div>
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default App;
