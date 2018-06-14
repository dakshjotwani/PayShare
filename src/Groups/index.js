import React from 'react';
import authorize from '../Session/authorize';
import GroupCard from './components/GroupCard';
import {CardDeck, Container} from 'reactstrap';

/**
 * React Component for /groups route
 */
class Groups extends React.Component {
    /**
     * Renders /groups page
     * @return {object} Groups page
     */
    render() {
        let group = {
            name: 'Apartment',
            users: {
                'dakshjotwani@gmail.com': {
                    name: 'Daksh Jotwani',
                },
                'maxylin@gmail.com': {
                    name: 'Max Lin',
                },
            },
        };
        return (
            <div>
                <h3 style={{paddingTop: '0.5em'}}>Your Groups</h3>
                <Container>
                    <CardDeck>
                        <GroupCard id='group_id1' group={group} />
                        <GroupCard id='group_id2' group={group} />
                        <GroupCard id='group_id3' group={group} />
                        <GroupCard id='group_id1' group={group} />
                        <GroupCard id='group_id2' group={group} />
                        <GroupCard id='group_id3' group={group} />
                    </CardDeck>
                </Container>
            </div>
        );
    }
}

const authCondition = (authUser) => !!authUser;

export default authorize(authCondition)(Groups, '/');
