import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {firebase, auth} from './fire';


class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authed: this.props.authed
        };
        this.uiConfig = {
            signInFlow: 'popup',
            signInSuccessUrl: '/expenses',
            signInOptions: [
                firebase.auth.EmailAuthProvider.PROVIDER_ID, 
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            ]
        };
    }

        /*
    componentDidMount() {
        this.unregisterAuthObserver = auth.onAuthStateChanged(
            (user) => this.setState({isSignedIn: !!user})
        );
    }

    componentWillUnmount() {
        this.unregisterAuthObserver();
    } */

    render() {
        if (!this.state.authed) {
            return (
                <div>
                    <h1> Sign in </h1>
                    <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth}/>
                </div>
            )
        }

        return (
            <div>
                <h1> You are already signed in! </h1>
            </div>
        )
    }
}

export default SignIn;
