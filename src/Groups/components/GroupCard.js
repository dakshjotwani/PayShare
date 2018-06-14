import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardBody, CardTitle, CardSubtitle} from 'reactstrap';
import {Link} from 'react-router-dom';

/**
 * Renders Card for a Group in user's group list
 */
export default class GroupCard extends React.Component {
    /**
     * Renders Card with prop information and link to group page
     * @return {object} Group Card
     */
    render() {
        let users = this.props.group.users;
        let names = Object.keys(users).map((key) => users[key].name);

        return (
            <Card
                tag={Link}
                to={'/groups/' + this.props.id}
                style={{
                    color: 'black',
                    textDecoration: 'none',
                }}
            >
                <CardBody>
                    <CardTitle>
                        {this.props.group.name}
                    </CardTitle>
                    <CardSubtitle>
                        {names.join(', ')}
                    </CardSubtitle>
                </CardBody>
            </Card>
        );
    }
}

GroupCard.propTypes = {
    id: PropTypes.string.isRequired,
    group: PropTypes.shape({
        name: PropTypes.string.isRequired,
        users: PropTypes.objectOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
        })),
    }),
};
