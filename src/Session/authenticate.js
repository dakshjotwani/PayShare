import React from 'react';

import AuthContext from './AuthContext';
import {db, auth} from '../Firebase/fire';

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
                if (authUser) {
                    this.setState(() => ({authUser}));
                    db.collection('users').doc(authUser.email).get()
                        .then((doc) => {
                            if (!doc.exists) {
                                let data = {
                                    name: authUser.displayName,
                                    email: authUser.email,
                                    uid: authUser.uid,
                                };
                                db.collection('users').doc(authUser.email)
                                    .set(data);
                            }
                        });
                } else {
                    this.setState(() => ({authUser: null}));
                }
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
