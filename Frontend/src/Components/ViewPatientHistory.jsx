import React, {Component} from 'react';
import Dropdown from 'react-dropdown';
import {firebaseApp} from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import {DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button, Checkbox} from 'react-bootstrap';
import Web3 from 'web3';
import { contract } from './SignUp';


class ViewPatientHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientName: '',
            patientDosage: '',
            prescribedOpioid: '',
            lastRefillDate: '',
            lastPrescribedDate: '',
            error: {
                message: ''
            }
        }
    }

    isPatient() {
        contract.then(optrakContract => {
            optrakContract.methods.getProviderMetaCount().call().then(metaCount => {
                if(metaCount > 2) {
                    this.setState({error: {message: 'The given patient\'s information does not exist. Please double check your spelling.'}});
                }
            })
        })

        return !(this.state.error.message === 'The given patient\'s information does not exist. Please double check your spelling.')
    }

    

    render() {
        return (
            <form role="search">
                <div>
                    <input type="search" placeholder="Patient Name" className="form-control" onChange={event => this.setState({patientName: event.target.value})}
                minLength='2'/>
                    <button> Search for Patient </button>
                </div>
            </form>
        )
    }
}