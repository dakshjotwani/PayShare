import React, { Component } from 'react';
import {auth, db} from './fire';
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
import { Jumbotron, Button } from 'reactstrap'

const Home = () => (
    <div>
        <Jumbotron>
            <h1 className="display-3">PayShare</h1>
            <p className="lead">This is a simple hero unit, a simple Jumbotron-style component for calling extra attention to featured content or information.</p>
            <hr className="my-2" />
            <p>It uses utility classes for typgraphy and spacing to space content out within the larger container.</p>
            <p className="lead">
                <Button color="primary">Learn More</Button>
            </p>
        </Jumbotron>
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
            if (user) {
                db.collection('users').doc(user.email).get()
                    .then((doc) => {
                        if (!doc.exists) {
                            var data = {
                                name: user.displayName,
                                email: user.email,
                                uid: user.uid
                            };
                            db.collection('users').doc(user.email).set(data);
                        }
                    });
                this.setState({authed: user})
            } else {
                this.setState({authed: null});
            }
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
