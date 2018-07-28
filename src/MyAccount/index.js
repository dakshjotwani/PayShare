import React from 'react';
import authorize from '../Session/authorize';
import './index.css';
import {Jumbotron} from 'reactstrap';

class MyAccount extends React.Component {
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
