import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import { firebaseApp } from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import { DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button, Checkbox } from 'react-bootstrap';
import Web3 from 'web3';
import { contract } from './SignUp';

function PatientForm(props) {
    if (props.clicked) {
        return (
            <div>
                <h1>{props.patientName}</h1>
                <div>
                    <h4> Latest Prescription: {props.prescribedOpioid} </h4>
                    <div>
                        <h4> Patient Dosage: {props.patientDosage} </h4>
                        <div>
                            <h4> Last Refill Date: {props.lastRefillDate} </h4>
                            <div>
                                <h4> Last prescribed date: {props.lastPrescribedDate}</h4>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        )
    }
    else {
        return null;
    }

}

class ViewPatientHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            patientName: '',
            sentName: '',
            patientDosage: '',
            prescribedOpioid: '',
            lastRefillDate: '',
            lastPrescribedDate: '',
            clicked: false,
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

    isPatient() {
        contract.then(optrakContract => {
            optrakContract.methods.getProviderMetaCount(this.state.patientName).call().then(metaCount => {
                if (metaCount < 2) {
                    this.setState({ error: { message: 'The given patient\'s information does not exist. Please double check your spelling.' } });
                    this.setState({clicked: false});
                }
            })
        })

        return !(this.state.error.message === 'The given patient\'s information does not exist. Please double check your spelling.')
    }


    onClick(e) {
        e.preventDefault();
        if (this.isPatient()) {
            this.setState({sentName: this.state.patientName});
            console.log(this.state.sentName);
            contract.then(optrakContract => {
                optrakContract.methods.getMetaDataAccess(this.state.patientName, 'Prescription', this.state.userName).call().then(access => {
                    if (access) {
                        optrakContract.methods.getMetaData(this.state.patientName, 'Prescription').call().then(content => {
                            this.setState({ prescribedOpioid: content });
                        })
                    }
                    else {
                        this.setState({ error: { message: "You do not have access to this patient\'s prescription details" } });
                        this.setState({clicked: false});
                    }
                })
                optrakContract.methods.getMetaDataAccess(this.state.patientName, 'Dosage', this.state.userName).call().then(access => {
                    if (access) {
                        optrakContract.methods.getMetaData(this.state.patientName, 'Dosage').call().then(content => {
                            this.setState({ patientDosage: content });
                        })
                    }
                })

                optrakContract.methods.getMetaDataAccess(this.state.patientName, 'Last Refill Date', this.state.userName).call().then(access => {
                    if (access) {
                        optrakContract.methods.getMetaData(this.state.patientName, 'Last Refill Date').call().then(content => {
                            this.setState({ lastRefillDate: content });
                        })
                    }
                })

                optrakContract.methods.getMetaDataAccess(this.state.patientName, 'Last Prescribed Date', this.state.userName).call().then(access => {
                    if (access) {
                        optrakContract.methods.getMetaData(this.state.patientName, 'Last Prescribed Date').call().then(content => {
                            this.setState({ lastPrescribedDate: content });
                        })
                    }
                })

            })
            this.setState({clicked: true});
            
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
                <form inline="true">
                    <div>
                        <input type="text" placeholder="Patient Name" className="form-control" onChange={event => this.setState({ patientName: event.target.value.trim() } )}
                            minLength='2' />
                        <button className="btn btn-primary" onClick={(e) => this.onClick(e)}> Search for Patient </button>
                        <div>
                        <PatientForm  clicked={this.state.clicked} prescribedOpiod={this.state.prescribedOpioid} patientName={this.state.sentName} patientDosage={this.state.patientDosage} lastPrescribedDate={this.state.lastPrescribedDate}
                        lastRefillDate={this.state.lastRefillDate}/>
                        </div>
                    </div>
                </form>
                <div>{this.state.error.message}</div>
                <div><Link to="./app"> Back to main app </Link></div>
            </div>
        )
    }
}
export default ViewPatientHistory;