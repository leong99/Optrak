import React, {Component} from 'react';
import Dropdown from 'react-dropdown';
import {firebaseApp} from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import {DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import Web3 from 'web3';
import { contract } from './SignUp';

class UpdatePatientHistory extends Component{

    constructor(props){
        super(props);
        this.state={
            patientName: '',
            temp: '',
            patientDosage: '',
            lastPrescribedDate: '',
            lastRefillDate: ''
        };
    }

    render(){
        console.log(this.state.temp);
        const displayScreen= (this.state.patientName==='') ?
                (
                <React.Fragment>
                <h3> Enter patient name </h3>
                <FormGroup controlId="formInLineName">
                <ControlLabel>
                </ControlLabel>{' '}
                <FormControl
                onChange={event => this.setState({temp: event.target.value})}
                type="text" 
                placeholder="Name" />
                </FormGroup>{' '}
                <Button
                onClick={()=>{this.setState({patientName: this.state.temp})}}
                type="submit"
                >
                Search Name
                </Button>
                </React.Fragment>
                ):(null);

        return(
            <div>
            {displayScreen}
                
            
            </div>

        )
    }
    
}

export default UpdatePatientHistory;