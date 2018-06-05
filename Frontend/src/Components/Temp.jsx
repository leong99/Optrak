//Trying to add an input box that appears when a particular drop-down option is selected

import React, {Component} from 'react';
import {DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';


class Temp extends Component{
    constructor (props){
        super(props);
        this.state={
            btnTitle:'User Type',
            formDisabled:true
        }
    }
    render(){
        return(
        <React.Fragment>
        <DropdownButton
      bsStyle={'primary'}
      title={this.state.btnTitle}
      key={1}
      id={`dropdown-basic-1`}
    >
      <MenuItem eventKey="Patient" onSelect={(e)=>{this.setState({btnTitle: e});}}>
      Patient
      </MenuItem>
      <MenuItem eventKey="Provider" onSelect={(e)=>{this.setState({btnTitle: e});
      this.setState({formDisabled: false});}}>
      Provider
      </MenuItem>
    </DropdownButton>
    <form inline>
    <FormGroup controlId="formInlinePubKey">
      <ControlLabel>Public Key</ControlLabel>{' '}
      <FormControl type="text" placeholder="a12345" />
    </FormGroup>{' '}
    
    <Button type="submit">Register</Button>
  </form>
  </React.Fragment>
  );
    
    }
}

export default Temp;