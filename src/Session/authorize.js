import React from 'react';
import {withRouter} from 'react-router-dom';

import AuthContext from './AuthContext';
import {auth} from '../Firebase/fire';

const authorize = (condition) => (Component) => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            auth.onAuthStateChanged((authUser) => {
                if (!condition(authUser)) {
                    this.props.history.push('/404');
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
