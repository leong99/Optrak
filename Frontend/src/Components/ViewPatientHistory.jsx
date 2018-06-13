import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import { firebaseApp } from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import { DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button, Checkbox } from 'react-bootstrap';
import Web3 from 'web3';
import { contract } from './SignUp';

//Displays patient's associated information
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
            },
            isMounted: false,
            status: false
        }


    }

    componentDidMount() {
        //best way to get the current user's name and save it
            firebaseApp.auth().onAuthStateChanged(async user => {
                if (user) {
                   await this.setState({ userName: user.displayName });
                    contract.then(optrakContract => {
                        optrakContract.methods.getProviderInfo(this.state.userName, optrakContract.options.from).call().then(provStatus => {
                            this.setState({ status: provStatus });
                        })
                    })
                }

            })
    }

    isPatient() {
        contract.then(optrakContract => {
            optrakContract.methods.getProviderMetaCount(this.state.sentName).call().then(metaCount => {
                if (metaCount < 2) {
                    //A patient has to have at least 2 pieces of metadata in order to actually exist e.g Prescription and Dosage
                    this.setState({ error: { message: 'The given patient\'s information does not exist. Please double check your spelling.' } });
                    this.setState({ clicked: false });
                }
            })
        })

        return !(this.state.error.message === 'The given patient\'s information does not exist. Please double check your spelling.')
    }


    onClick(e) {
        e.preventDefault(); //stops the button from immediately submitting a form upon click
        if (this.isPatient() && this.state.status) {
            this.setState({ sentName: this.state.patientName });
            //The name that was in the search box as the button was clicked
            console.log(this.state.sentName);

            //contract is a promise that returns our smart contract instance as it's return value, meaning
            //when we use the smart contract it must be a .then()
            contract.then(optrakContract => {

                //checks to see if the current user has access to this patient's information
                optrakContract.methods.getMetaDataAccess(this.state.patientName, 'Prescription', this.state.userName).call().then(access => {
                    if (access) {
                        optrakContract.methods.getMetaData(this.state.patientName, 'Prescription').call().then(content => {
                            this.setState({ prescribedOpioid: content });
                            //When access is verified, the patient's information is stored in the state.
                            //This will have to be updated for security purposes in the future
                        })
                    }
                    else {
                        this.setState({ error: { message: "You do not have access to this patient\'s prescription details" } });
                        this.setState({ clicked: false });
                        //Sets 'clicked' to false in order to prevent a PatientForm from being shown
                    }
                })

                //Next few blocks of code mimic the original for different piecse of patient metadata
                //More patient metadata can be added as use cases are fleshed out
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
            this.setState({ clicked: true }); //sets 'clicked' to true in order to be able to use the PatientForm

        }
        else if(this.isPatient() && !this.state.status) {
            this.setState({sentName: this.state.userName});
            contract.then(optrakContract => {
                optrakContract.methods.getMetaData(this.state.sentName, 'Prescription').call().then(data => {
                    this.setState({prescribedOpioid: data});
                })
                optrakContract.methods.getMetaData(this.state.sentName, 'Dosage').call().then(data => {
                    this.setState({patientDosage: data});
                })
                optrakContract.methods.getMetaData(this.state.sentName, 'Last Prescribed Date').call().then(data => {
                    this.setState({lastPrescribedDate: data});
                })
                optrakContract.methods.getMetaData(this.state.sentName, 'Last Refill Date').call().then(data => {
                    this.setState({lastRefillDate: data});
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
        console.log(this.state);
        return (
        this.state.status ? (
            <div>
                <form inline="true">
                    <div>
                        <input type="text" placeholder="Patient Name" className="form-control" onChange={event => this.setState({ patientName: event.target.value.trim() })}
                            minLength='2' />
                        <button className="btn btn-primary" onClick={(e) => this.onClick(e)}> Search for Patient </button>
                        <div>
                            <PatientForm clicked={this.state.clicked} prescribedOpioid={this.state.prescribedOpioid} patientName={this.state.sentName} patientDosage={this.state.patientDosage} lastPrescribedDate={this.state.lastPrescribedDate}
                                lastRefillDate={this.state.lastRefillDate} />
                        </div>
                    </div>
                </form>
                <div>{this.state.error.message}</div>
                <div><Link to="./app"> Back to main app </Link></div>
            </div>) : <div>
                <div>
                    <button className="btn btn-primary" onClick={e => this.onClick(e)}> Display History </button>
                <PatientForm clicked={this.state.clicked} prescribedOpioid={this.state.prescribedOpioid} patientName={this.state.sentName} patientDosage={this.state.patientDosage} lastPrescribedDate={this.state.lastPrescribedDate}
                                lastRefillDate={this.state.lastRefillDate} isPatient={true}/>
                </div>
                <div>{this.state.error.message}</div>
                <div><Link to="./app"> Back to main app </Link></div>
            </div>
        )
    }
}
export default ViewPatientHistory;