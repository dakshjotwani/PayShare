import React from 'react';
import authorize from '../Session/authorize';
import './index.css';
import {Jumbotron} from 'reactstrap';
/**
 * My Account page for user
 */
class MyAccount extends React.Component {
    /**
     * Renders my account page
     * @return {object} MyAccount page
     */
    render() {
        return (
            <div>
                <Jumbotron fluid className="head1">
                    <h1 className="display-3">Under Development</h1>
                </Jumbotron>
            </div>
        );
    }
}

const authCondition = (authUser) => !!authUser;

export default authorize(authCondition)(MyAccount, '/');
