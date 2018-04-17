import React from 'react'
import {
    Label, Input, FormGroup,
} from 'reactstrap';

class Payer extends React.Component {
    render() {
        const namelist = this.props.users.map((user, index) =>
            <option key={index}>{user}</option>
        );
        return (
            <FormGroup>
                <Label for="selectPayer">Select Payer</Label>
                <Input value={this.props.defaultPayer} onChange={this.props.onChange} type="select" name="select" id="exampleSelect" required>
                    {namelist}
                </Input>
            </FormGroup>
        );
    }
}

export default Payer;