import React from 'react';

import AuthContext from './AuthContext';
import {auth} from '../firebase/fire';

const authenticate = (Component) =>
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                authUser: null,
            };
        }

        componentDidMount() {
            auth().onAuthStateChanged((authUser) => {
                authUser
                    ? this.setState(() => ({authUser}))
                    : this.setState(() => ({authUser: null}));
            });
        }

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
