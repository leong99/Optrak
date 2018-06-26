import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import { firebaseApp } from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import { DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button, Checkbox } from 'react-bootstrap';
import Web3 from 'web3';
import { contract } from './SignUp';

class AddPatientHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            patientName: '',
            uid: '',
            error: {
                message: ''
            },
            overwrite: true
        };

    }

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            if (!user) {
                this.props.history.push('./signin');

                //makes sure that the current user is signed in befor being able to access this page
            }
            else {
                console.log(this.state.userName);
                this.setState({ userName: user.displayName });
            }

        })
    }

    //Calls smart contract and adds different metadata to it. This is likely not the data that we are going to be using
    //But this can be modified easily to fit any data that need be stored on the blockchain
    //Current program assumes 1 opioid prescription to a patient
    addPatientInfo = async () => {
        if (this.checkFields()) {
            contract.then(optrakContract => {
                //TODO: Verify unique uid
                optrakContract.methods.addPatient(this.state.patientName, optrakContract.options.from, this.state.uid).send().then(result => {
                    if (result) {
                        alert('Patient succcessfully added to registry. Redirecting to main app now.')
                        this.props.history.push('./App');
                    }
                    else {
                        alert('Patient was not able to successfully be added. Please refresh and try again.');
                    }
                });
            })
        }

    }

    /**
     * Checks to see that all fields that are necessary are properly filled out
     */
    checkFields() {
        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ userName: user.displayName });
            }
        })

        if (this.state.patientName == '') {
            this.setState({ error: { message: 'Please enter a patient name' } });
            return false;
        }
        else {
            if (this.state.uid == '') {
                this.setState({ error: { message: 'Please enter a unique patient id' } });
                return false;
            }
        }
        return true;
    }

    render() {
        console.log(this.state);

        return (
            <div>
                <h3>Enter patient information</h3>
                <form inline='true'>
                    <div className="form-group">
                        <input type="text" placeholder="Enter Patient Name (Name on Records)" className="form-control" style={{ marginRight: '5px' }}
                            onChange={event => this.setState({ patientName: event.target.value })} />
                        <input type="text" placeholder="Enter Patient's Unique ID" className="form-control" style={{ marginRight: '5px' }}
                            onChange={event => this.setState({ uid: event.target.value })} />
                        <button className="btn btn-success" type="button" onClick={() => { this.addPatientInfo() }}>
                            Submit
                    </button>
                    </div>
                </form>
                <div>{this.state.error.message}</div>
                <div><Link to="./app"> Go back to main page </Link></div>
            </div>
        )
    }
}

export default AddPatientHistory;