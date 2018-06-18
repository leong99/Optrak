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
            accessor: '',
            patientName: '',
            patientDosage: '',
            prescribedOpioid: '',
            lastRefillDate: '',
            lastPrescribedDate: '',
            error: {
                message: ''
            },
            grantAccess: false,
            status: false
        }

    }


    //If you're reading through this function, I apologize. Until I figure out how to fire the transactions as an atomic unit then 
    //This is the only way to ensure that every single transaction successfully fires, and that the others aren't triggered unless all 
    //prior transactions have been successful.
    grantAccess(e, accessReq) {
        e.preventDefault();
        if (this.checkFields()) {
            if (this.isPatient() && this.state.status) {
                console.log('Made it this far');
                contract.then(optrakContract => {
                    optrakContract.methods.getMetaDataAccess(this.state.patientName, 'Prescription', this.state.userName).call()
                        .then(access => {
                            if (access) {
                                console.log("made it here too");
                                console.log(this.state);
                                optrakContract.methods.updateMetaDataAccess(this.state.patientName, 'Prescription', this.state.accessor, true).send()
                                    .on('receipt', receipt => {
                                        console.log('Access granted to prescription metadata');
                                        optrakContract.methods.getMetaDataAccess(this.state.patientName, 'Dosage', this.state.userName).call()
                                            .then(access => {

                                                if (access) {
                                                    console.log('checkpoint');
                                                    optrakContract.methods.updateMetaDataAccess(this.state.patientName, 'Dosage', this.state.accessor, true).send()
                                                        .on('receipt', receipt => {
                                                            console.log('Access granted to dosage metadata');
                                                            optrakContract.methods.getMetaDataAccess(this.state.patientName, 'Last Refill Date', this.state.userName).call()
                                                                .then(access => {
                                                                    if (access) {
                                                                        optrakContract.methods.updateMetaDataAccess(this.state.patientName, 'Last Refill Date', this.state.accessor, true).send().
                                                                            on('receipt', receipt => {
                                                                                console.log('Access granted to last refill date metadata');
                                                                                optrakContract.methods.getMetaDataAccess(this.state.patientName, 'Last Prescribed Date', this.state.userName).call()
                                                                                    .then(access => {
                                                                                        optrakContract.methods.updateMetaDataAccess(this.state.patientName, 'Last Prescribed Date', this.state.accessor, true
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
        } else if (this.isProvider() && !this.state.status) {
            contract.then(optrakContract => {
                optrakContract.methods.updateMetaDataAccess(this.state.userName, 'Prescription', this.state.accessor, accessReq).send().on('receipt', receipt => {
                    console.log('Access granted or revoked to prescription metadata');
                    optrakContract.methods.updateMetaDataAccess(this.state.userName, 'Dosage', this.state.accessor, accessReq).send().on('receipt', receipt => {
                        console.log('Access granted or revoked to dosage metadata');
                        optrakContract.methods.updateMetaDataAccess(this.state.userName, 'Last Prescription Date', this.state.accessor, accessReq).send().on('receipt', receipt => {
                            console.log('Access granted or revoked to last prescription date metadata');
                            optrakContract.methods.updateMetaDataAccess(this.state.userName, 'Last Refill Date', this.state.accessor, accessReq).send().on('receipt', receipt => {
                                console.log('Access granted or revoked to last refill date metadata');
                            }).catch(error => this.setState({ error: { message: 'Access updating for Last Refill Date Failed' } }));
                        }).catch(error => this.setState({ error: { message: 'Access updating for Last Prescription Date failed' } }));
                    }).catch(error => this.setState({ error: { message: 'Access updating for dosage failed' } }));
                }).catch(error => this.setState({ error: { message: 'Access updating for PRESCRIPTION failed' } }));
            })
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

    isProvider() {
        contract.then(optrakContract => {
            optrakContract.methods.getProviderPubkey(this.state.accessor).call().then(pubkey => {
                if (pubkey.length < 2) {
                    this.setState({ error: { message: 'This provider does not exist, please double check spelling' } });
                    this.setState({ clicked: false });
                } else {
                    optrakContract.methods.getMetaDataAccess(this.state.userName, 'Prescription', this.state.accessor).call().then(access => {
                        if (!access) {
                            this.setState({ error: { message: 'This provider does not have access to your information' } });
                        }
                    })
                }
            })
        })
        return !(this.state.error.message === 'This provider does not have access to your information' || this.state.error.message === 'This provider does not exist, please double check spelling');
    }

    checkFields() {
        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ userName: user.displayName });
                contract.then(optrakContract => {
                    optrakContract.methods.getProviderInfo(this.state.userName, optrakContract.options.from).call().then(provStatus => {
                        this.setState({ status: provStatus });
                    })
                })
            }
        })
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
        return this.state.status ?
            (<div>
                <h3>Grant patient access to another provider</h3>
                <form inline="true">
                    <input type="text" placeholder="Enter desired accessor" className="form-control" style={{ marginRight: '5px' }}
                        onChange={event => this.setState({ accessor: event.target.value.trim() })} />
                    <input type="text" placeholder="Enter patient to share" className="form-control" style={{ marginRight: '5px' }}
                        onChange={event => this.setState({ patientName: event.target.value.trim() })} />
                    <button className="btn btn-success" onClick={e => this.grantAccess(e, true)}> Submit </button>
                </form>
                <div>{this.state.error.message}</div>
                <div><Link to='./app'> Go back to main app </Link></div>
            </div>)
            : (<div>
                <h3> Grant or revoke access from a healthcare provider </h3>
                <form inline="true">
                    <input type="text" placeholder="Enter desired/undesired accessor" className="form-control" style={{ marginRight: '5px' }}
                        onChange={event => this.setState({ accessor: event.target.value.trim() })} />
                    <div>
                        <button className="btn btn-success" onClick={e => this.grantAccess(e, true)}> Submit </button>
                        <button className="btn btn-warning" onClick={e => this.grantAccess(e, false)}> Revoke Access </button>
                    </div>
                    <div><Link to="./app"> Return to main app </Link></div>
                </form>
            </div>)
    }
}

export default GrantAccess;