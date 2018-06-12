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
            prescription: '',
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

    checkPatientAccess(){ //checks to see if user has permission to update history
        this.setState({userName: firebaseApp.auth().currentUser});
        contract.then(optrakContract =>{
            //assuming that having access to the prescription means there is access to all fields
            optrakContract.methods.getMetaDataAccess(this.state.patientName, 'Prescription', this.state.userName).call().then(
                () => {return true}, //promise fulfilled
                () => { //promise rejected
                    this.setState({ error: {message: `The current user ${this.state.userName} does not have permission to update ${this.state.patientName}\'s records.`}});
                    return false;
                }
            )
        })
    }

    updatePatientHistory(){
        if(this.checkFields()){
            contract.then(optrakContract=>{
                optrakContract.methods.addMetaData(this.state.patientName, 'Prescription', this.state.prescription, true).send()
                .on('receipt', this.successUpdate('Prescription'))
                .catch(this.failUpdate('Prescription'));
                optrakContract.methods.addMetaData(this.state.patientName, 'Dosage', this.state.patientDosage, true).send()
                .on('receipt', this.successUpdate('Dosage'))
                .catch(this.failUpdate('Dosage'));
                optrakContract.methods.addMetaData(this.state.patientName, 'Last Prescribed Date', this.state.lastPrescribedDate, true).send()
                .on('receipt', this.successUpdate('Last Prescribed Date'))
                .catch(this.failUpdate('Last Prescribed Date'));
                optrakContract.methods.addMetaData(this.state.patientName, 'Last Refill Date', this.state.lastRefillDate, true).send()
                .on('receipt', this.successUpdate('Last Refill Date'))
                .catch(this.failUpdate('Last Refill Date'));

            }
        }
    }

    successUpdate(param){
        console.log(`${param} metadata update was successful`);
    }

    failUpdate(param){
        this.setState({error: {message: `${param} transaction failed, please refresh and try again.`}});
    }

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
                            onChange={event => this.setState({ patientName: event.target.value })}
                            type="text"
                            placeholder="Name" />
                    </FormGroup>{' '}
                    <Button
                        onClick={() => {
                            this.searchName(this.state.patientName)
                        }}
                        type="submit"
                    >
                        Search Name
                </Button>
                </React.Fragment>
            ) :
            (
                <React.Fragment>
                    <h3> Enter patient information </h3>
                    <FormGroup controlId="formInLineName">
                        <ControlLabel>
                        </ControlLabel>{' '}
                        <FormControl
                            onChange={event => this.setState({ patientDosage: event.target.value })}
                            type="text"
                            placeholder="Dosage" />
                        <FormControl
                            onChange={event => this.setState({ prescription: event.target.value })}
                            type="text"
                            placeholder="Prescription" />
                        <FormControl
                            onChange={event => this.setState({ lastPrescribedDate: event.target.value })}
                            type="text"
                            placeholder="Prescribed date" />
                        <FormControl
                            onChange={event => this.setState({ lastRefillDate: event.target.value })}
                            type="text"
                            placeholder="Date of last refill" />

                    </FormGroup>{' '}
                    <Button
                        onClick={() => {
                            if (this.checkPatientAccess()){
                                this.updatePatientHistory(this.state);
                            }
                            else{
                                //maybe prompt user to enter in a new name?
                            }
                        }}
                        type="submit"
                    >
                        Update Information
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