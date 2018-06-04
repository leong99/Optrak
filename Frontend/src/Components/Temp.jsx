//Trying to add an input box that appears when a particular drop-down option is selected

import React, {Component} from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';


class Temp extends Component{
    constructor (props){
        super(props);
        this.state={
            btnTitle:'User Type'
        }
    }
    render(){
        return(
            <div>
        <DropdownButton
      bsStyle={'primary'}
      title={this.state.btnTitle}
      key={1}
      id={`dropdown-basic-1`}
    >
      <MenuItem eventKey="Patient" onSelect={(e)=>{this.setState({btnTitle: e});}}>
      Patient
      </MenuItem>
      <MenuItem eventKey="Provider" onSelect={(e)=>{this.setState({btnTitle: e});}}>
      Provider
      </MenuItem>
    </DropdownButton>
    </div>);
    }
}

export default Temp;