import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {firebase, auth} from './fire';


class SignIn extends React.Component {
    state = {
        isSignedIn: false
    };
    
    uiConfig = {
        signInFlow: 'popup',
        signInSuccessUrl: '/expenses',
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID, 
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ]
    };
  
    componentDidMount() {
        this.unregisterAuthObserver = auth.onAuthStateChanged(
            (user) => this.setState({isSignedIn: !!user})
        );
    }

    componentWillUnmount() {
        this.unregisterAuthObserver();
    }

    render() {
        if (!this.state.isSignedIn) {
            return (
                <div>
                    <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth}/>
                </div>
            )
        }
        
        return (
            <div>
                
            </div>
        )
    }
}

export default SignIn;
