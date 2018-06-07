import React from 'react';
import PropTypes from 'prop-types';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {firebase, auth} from './fire';

/**
 * Sign in page /signin
 */
class SignIn extends React.Component {
    /**
     * @constructor
     * @param {object} props passed down by parent
     */
    constructor(props) {
        super(props);
        this.uiConfig = {
            signInFlow: 'popup',
            signInSuccessUrl: '/expenses',
            signInOptions: [
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            ],
        };
    }

    /**
     * Renders signin page
     * @return {object} Sign in page
     */
    render() {
        if (!this.props.authed) {
            return (
                <div>
                    <h1> Sign in </h1>
                    <StyledFirebaseAuth
                        uiConfig={this.uiConfig}
                        firebaseAuth={auth}
                    />
                </div>
            );
        }

        return (
            <div>
                <h1> You are already signed in! </h1>
            </div>
        );
    }
}

SignIn.propTypes = {
    authed: PropTypes.object,
};

export default SignIn;
