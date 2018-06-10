import React from 'react';
import {withRouter} from 'react-router-dom';

import AuthContext from './AuthContext';
import {auth} from '../Firebase/fire';

const authorize = (condition) => (Component, redirectTo) => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            auth.onAuthStateChanged((authUser) => {
                if (!condition(authUser)) {
                    this.props.history.push(redirectTo);
                }
            });
        }

        render() {
            return (
                <AuthContext.Consumer>
                    {(authUser) => {
                        return condition(authUser) ? <Component /> : null;
                    }}
                </AuthContext.Consumer>
            );
        }
    }

    return withRouter(WithAuthorization);
};

export default authorize;
