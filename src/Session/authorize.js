import React from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthContext from './AuthContext';
import {auth} from '../Firebase/fire';

const authorize = (condition) => (Component, redirectTo) => {
    /** Class to authorize user when they access the Component's route */
    class WithAuthorization extends React.Component {
        /**
         * Attaches auth listener on mount, and redirects if condition
         * on current user is not fulfilled
         */
        componentDidMount() {
            auth.onAuthStateChanged((authUser) => {
                if (!condition(authUser)) {
                    this.props.history.push(redirectTo);
                }
            });
        }

        /**
         * Renders Component if condition on current user is satisfied
         * @return {object} Component if valid, null otherwise
         */
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

    WithAuthorization.propTypes = {
        history: PropTypes.object,
    };

    return withRouter(WithAuthorization);
};

export default authorize;
