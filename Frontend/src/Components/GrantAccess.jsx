import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import { firebaseApp } from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import { DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button, Checkbox } from 'react-bootstrap';
import Web3 from 'web3';
import { contract } from './SignUp';


class GrantAccess extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            accesssor: '',
            patientName: '',
            patientDosage: '',
            prescribedOpioid: '',
            lastRefillDate: '',
            lastPrescribedDate: '',
            error: {
                message: ''
            }

        }
        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ userName: user.displayName });
            }
        })
    }

    //If you're reading through this function, I apologize. Until I figure out how to fire the transactions as an atomic unit then 
    //This is the only way to ensure that every single transaction successfully fires, and that the others aren't triggered unless all 
    //prior transactions have been successful.
    grantAccess(e) {
        e.preventDefault();
        if (this.checkFields()) {
            if (this.isPatient()) {
                console.log('Made it this far');
                contract.then(optrakContract => {
                    optrakContract.methods.getMetaDataAccess(this.state.patientName, 'Prescription', this.state.userName).call()
                        .then(access => {
                            if (access) {
                                console.log("made it here too");
                                console.log(this.state);
                                optrakContract.methods.updateMetaDataAccess(this.state.patientName, 'Prescription', this.state.accesssor, true).send()
                                    .on('receipt', receipt => {
                                        console.log('Access granted to prescription metadata');
                                        optrakContract.methods.getMetaDataAccess(this.state.patientName, 'Dosage', this.state.userName).call()
                                            .then(access => {

                                                if (access) {
                                                    console.log('checkpoint');
                                                    optrakContract.methods.updateMetaDataAccess(this.state.patientName, 'Dosage', this.state.accesssor, true).send()
                                                        .on('receipt', receipt => {
                                                            console.log('Access granted to dosage metadata');
                                                            optrakContract.methods.getMetaDataAccess(this.state.patientName, 'Last Refill Date', this.state.userName).call()
                                                                .then(access => {
                                                                    if (access) {
                                                                        optrakContract.methods.updateMetaDataAccess(this.state.patientName, 'Last Refill Date', this.state.accesssor, true).send().
                                                                            on('receipt', receipt => {
                                                                                console.log('Access granted to last refill date metadata');
                                                                                optrakContract.methods.getMetaDataAccess(this.state.patientName, 'Last Prescribed Date', this.state.userName).call()
                                                                                    .then(access => {
                                                                                        optrakContract.methods.updateMetaDataAccess(this.state.patientName, 'Last Prescribed Date', this.state.accesssor, true
                                                                                        ).send().on('receipt', receipt => {
                                                                                            console.log('Access granted');
                                                                                        }).catch(error => this.setState({ error: { message: 'Final transaction failed' } }));
                                                                                    })
                                                                            }).catch(error => this.setState({ error: { message: 'Transaction failed' } }))
                                                                    }
                                                                })
                                                        }).catch(error => this.setState({ error: { message: 'Transaction for dosage metadata failed, please refresh and try again' } }));
                                                }
                                            })
                                    }).catch(error => { this.setState({ error: { message: 'Transaction failed' } }); });
                            }
                        }).catch(error => { error: { message: 'Something went wrong. Please refresh and try again' } })
                })
            }
        }
    }
    isPatient() {
        contract.then(optrakContract => {
            optrakContract.methods.getProviderMetaCount(this.state.patientName).call().then(metaCount => {
                if (metaCount < 2) {
                    //A patient has to have at least 2 pieces of metadata in order to actually exist e.g Prescription and Dosage
                    this.setState({ error: { message: 'The given patient\'s information does not exist. Please double check your spelling.' } });
                    this.setState({ clicked: false });
                }
            })
        })

        return !(this.state.error.message === 'The given patient\'s information does not exist. Please double check your spelling.')
    }

    checkFields() {
        if (this.state.patientName === '') {
            this.setState({ error: { message: 'Please enter a patient name' } });
            return false;
        }
        else if (this.state.accessor === '') {
            this.setState({ error: { message: 'Please enter an accessor name' } })
            return false;
        }
        else {
            return true;
        }
    }

    render() {
        firebaseApp.auth().onAuthStateChanged(user => {
            if (!user) {
                this.props.history.push('./signin');
            }
        })
        return (
            <div>
                <h3>Grant patient access to another provider</h3>
                <form inline="true">
                    <input type="text" placeholder="Enter desired accessor" className="form-control" style={{ marginRight: '5px' }}
                        onChange={event => this.setState({ accesssor: event.target.value.trim() })} />
                    <input type="text" placeholder="Enter patient to share" className="form-control" style={{ marginRight: '5px' }}
                        onChange={event => this.setState({ patientName: event.target.value.trim() })} />
                    <button className="btn btn-success" onClick={e => this.grantAccess(e)}> Submit </button>
                </form>
                <div>{this.state.error.message}</div>
                <div><Link to='./app'> Go back to main app </Link></div>
            </div>
        )
    }
}

export default GrantAccess;