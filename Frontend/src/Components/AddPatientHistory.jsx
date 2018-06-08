import React, {Component} from 'react';
import Dropdown from 'react-dropdown';
import {firebaseApp} from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import {DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import Web3 from 'web3';
import { contract } from './SignUp';

class AddPatientHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            patientName: '',
            patientDosage: '',
            lastPrescribedDate: '',
            lastRefillDate: '',
            overwrite: true
        };
    }

    addPatientInfo = async() => {
        contract.then(optrakContract => {
            if(optrakContract.methods.getMetaData(firebaseApp.auth().currentUser.displayName, ))
        })
    }

    render() {
        return(
        <div>
            <h3>Enter patient information</h3>
            <form inline='true'> 
                <div className="form-group">
                    <input type="text" placeholder="Enter Patient Name" className="form-control" style={{marginRight: '5px'}}
                    onChange={event => this.setState({patientName: event.target.value})}/>   
                    <input type="text" placeholder="Enter Prescribed Dosage" className="form-control" style={{marginRight: '5px'}}
                    onChange={event=> this.setState({patientDosage: event.target.value})}/>
                    <input type='text' placeholder="Enter Last Prescription Date" className="form-control" style={{marginRight:'5px'}}
                    onChange={event => this.setState({lastPrescribedDate: event.target.value})}
                    />
                    <input type='text' placeholder="Enter Last Refill Date" className="form-control" syle={{marginRight: '5px'}}
                    onChange={event => this.setState({lastRefillDate: event.target.value})}/>
                    <button className="btn btn-success" type="button">
                    Submit
                    </button>
                </div>
            </form>
        </div>
        )
    }
}