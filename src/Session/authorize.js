import React from 'react';
import {withRouter} from 'react-router-dom';

import AuthContext from './AuthContext';
import {auth} from '../firebase/fire';

const authorize = (condition) => (Component) => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            auth().onAuthStateChanged((authUser) => {
                if (!condition(authUser)) {
                    this.props.history.push('/signin');
                }
            });
        }

        render() {
            return (
                <AuthContext.Consumer>
                    {(authUser) => authUser ? <Component /> : null}
                </AuthContext.Consumer>
            );
        }
    }

    return withRouter(WithAuthorization);
};

export default authorize;
