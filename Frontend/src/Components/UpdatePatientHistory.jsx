import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import { firebaseApp } from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import { DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import Web3 from 'web3';
import { contract } from './SignUp';

class UpdatePatientHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName:'',
            patientExists: false,
            patientName: '',
            temp: '',
            patientDosage: '',
            lastPrescribedDate: '',
            lastRefillDate: '',
            error: {
                message: ''
            }
        };
    }

    searchName(name) { //checks that name exists and updates state if it does/doesn't
        contract.then(optrakContract => {
            optrakContract.methods.getProviderMetaCount(name).call().then(
                metaCount => {
                    console.log(metaCount);
                    if (metaCount <= 2) {
                        this.setState({ patientExists: false, patientName: '', error: { message: 'The given patient\'s information does not exist. Please double check your spelling.' } });
                    }
                    else {
                        this.setState({ patientExists: true, patientName: name });
                    }
                }
            )
        })

    }

    checkPatientAccess(name){ //checks to see if user has permission to update history
        this.setState({userName: firebaseApp.auth().currentUser});
        contract.then(optrakContract =>{
            optrakContract.methods.getMetaDataAccess(this.state.patientName, 'Prescription', this.state.userName).call().then(
                () => {return true}, //promise fulfilled
                () => { //promise rejected
                    this.setState({ error: {message: `The current user ${this.state.userName} does not have permission to update ${this.state.patientName}\'s records.`}});
                    return false;
                }
            )
        })
    }

    updatePatientHistory()

    checkFields() {
        if (this.state.prescription !== '' && this.state.patientDosage === '') {
            this.setState({ error: { message: 'Please enter a dosage for the prescribed opioid' } });
            return false;

        }
        else if (this.state.prescription === '' && this.state.patientDosage !== '') {
            this.setState({ error: { message: 'Please enter an opioid for the given dosage' } });
            return false;
        }
        else if (this.state.lastPrescribedDate === '') {
            this.setState({ error: { message: 'Please enter the last prescribed date' } });
            return false;
        }
        else if (this.state.lastRefillDate == '') {
            this.setState({ error: { message: 'Please enter the last refill date' } });
            return false;
        }
        return true;
    }

    render() {
        console.log(this.state);
        firebaseApp.auth().onAuthStateChanged(user => {
            if (!user){
                this.props.history.push('./signin');
            }
        })
        const displayScreen = (!this.state.patientExists) ? //conditionally renders based on patient existing
            (
                <React.Fragment>
                    <h3> Enter patient name </h3>
                    <FormGroup controlId="formInLineName">
                        <ControlLabel>
                        </ControlLabel>{' '}
                        <FormControl
                            onChange={event => this.setState({ temp: event.target.value })}
                            type="text"
                            placeholder="Name" />
                    </FormGroup>{' '}
                    <Button
                        onClick={() => {
                            this.searchName(this.state.temp)
                        }}
                        type="submit"
                    >
                        Search Name
                </Button>
                </React.Fragment>
            ) :
            (
                <React.Fragment>
                    <h3> Enter patient name </h3>
                    <FormGroup controlId="formInLineName">
                        <ControlLabel>
                        </ControlLabel>{' '}
                        <FormControl
                            onChange={event => this.setState({ temp: event.target.value })}
                            type="text"
                            placeholder="Name" />
                    </FormGroup>{' '}
                    <Button
                        onClick={() => {
                            this.searchName(this.state.temp)
                        }}
                        type="submit"
                    >
                        Search Name
                </Button>
                </React.Fragment>
            );

        return (
            <div>
                {displayScreen}


            </div>

        )
    }

}

export default UpdatePatientHistory;