import React from 'react';

import AuthContext from './AuthContext';
import {auth} from '../Firebase/fire';

const authenticate = (Component) =>
    class WithAuthentication extends React.Component {
        /**
         * @constructor
         * @param {object} props passed down by parent
         */
        constructor(props) {
            super(props);

            this.state = {
                authUser: null,
            };
        }

        /** Attaches auth listener on component mount */
        componentDidMount() {
            auth.onAuthStateChanged((authUser) => {
                authUser
                    ? this.setState(() => ({authUser}))
                    : this.setState(() => ({authUser: null}));
            });
        }

        /**
         * Renders component with AuthContext.Provider
         * @return {object} Component with global auth context
         */
        render() {
            const {authUser} = this.state;

            return (
                <AuthContext.Provider value={authUser}>
                    <Component />
                </AuthContext.Provider>
            );
        }
    };

export default authenticate;
