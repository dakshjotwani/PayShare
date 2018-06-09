import React from 'react';
import PropTypes from 'prop-types';
import {
    Label, Input, FormGroup,
} from 'reactstrap';

/**
 * Payer dropdown
 */
class Payer extends React.Component {
    /**
     * Renders payer dropdown
     * @return {object} payer dropdown
     */
    render() {
        const namelist = this.props.users.map((user, index) =>
            <option key={index}>{user}</option>
        );
        return (
            <FormGroup>
                <Label for="selectPayer">Select Payer</Label>
                <Input
                    value={this.props.defaultPayer}
                    onChange={this.props.onChange}
                    type="select"
                    name="select"
                    id="exampleSelect"
                    required
                >
                    {namelist}
                </Input>
            </FormGroup>
        );
    }
}

Payer.propTypes = {
    users: PropTypes.array,
    defaultPayer: PropTypes.string,
    onChange: PropTypes.func,
};

export default Payer;
