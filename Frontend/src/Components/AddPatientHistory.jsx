import React, {Component} from 'react';
import Dropdown from 'react-dropdown';
import {firebaseApp} from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import {DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button, Checkbox} from 'react-bootstrap';
import Web3 from 'web3';
import { contract } from './SignUp';

class AddPatientHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            patientName: '',
            prescription: '',
            patientDosage: '',
            lastPrescribedDate: '',
            lastRefillDate: '',
            error: {
                message: ''
            },
            overwrite: true
        };
        
    }

    //Calls smart contract and adds different metadata to it. This is likely not the data that we are going to be using
    //But this can be modified easily to fit any data that need be stored on the blockchain
    //Current program assumes 1 opioid prescription to a patient
    addPatientInfo = async() => {
        
        //verifies that there are no errors in the inputs of this form
        if(this.checkFields()) {
            this.setState({error: {message: 'This will take a minute or two, please be patient'}})
            //Should implement some kind of loading thing here
            contract.then(optrakContract => {
                //contract returns instance of our smart contract as its promise value, makigng us use a .then()
                optrakContract.methods.addMetaData(this.state.patientName, 'Prescription', this.state.prescription, this.state.overwrite).send().on('receipt', receipt => {
                   //Creates a transaction on the client side in order to add a certain piece of metadata to a patient
                    console.log('Prescription metadata successfully added');
                    //Updates the current provider's metadata access, allowing them to fully see/control a patient's information 
                    //which they have added

                    //This and all further transactions created fire upon the receipt of the previous transaction being received
                    //To improve upon this we can find out how to implement these transactions as an atomic unit
                    optrakContract.methods.updateMetaDataAccess(this.state.patientName, 'Prescription', this.state.userName, true).send().on('receipt',receipt => {
                        console.log('Access to this patient\'s prescription metadata granted');
                        optrakContract.methods.addMetaData(this.state.patientName, 'Dosage', this.state.patientDosage, this.state.overwrite).send().on('receipt', receipt => {
                            console.log('Dosage metadata successfully added');
                            optrakContract.methods.updateMetaDataAccess(this.state.patientName, 'Dosage', this.state.userName, true).send().on('receipt', receipt => {
                                 console.log('Access to this patient\'s dosage metadata granted');
                                 optrakContract.methods.addMetaData(this.state.patientName, 'Last Prescribed Date', this.state.lastPrescribedDate, this.state.overwrite).send()
                            .on('receipt', receipt => {
                                console.log('Last prescription date metadata successfully added');
                                optrakContract.methods.updateMetaDataAccess(this.state.patientName, 'Last Prescribed Date', this.state.userName, true).send().on('receipt', receipt => {
                                    console.log('Access to this patient\'s last prescription date metadata granted');
                                    optrakContract.methods.addMetaData(this.state.patientName, 'Last Refill Date', this.state.lastRefillDate, this.state.overwrite).send()
                                .on('receipt', receipt => {
                                    optrakContract.methods.updateMetaDataAccess(this.state.patientName, 'Last Refill Date', this.state.userName, true).send().on('receipt', receipt => {
                                        console.log('Access granted to last refill date');
                                        console.log('Last Refill date transaction successfully received');
                                        firebaseApp.database().ref('Users/' + this.state.userName + '/Patients/' + this.state.patientName).push({
                                            Dosage: this.state.patientDosage,
                                            Prescription: this.state.prescription,
                                            lastPrescribedDate : this.state.lastPrescribedDate,
                                            lastRefillDate : this.state.lastRefillDate
                                        })
                                        alert('Patient info added successfully. Returning to main app page');
                                        this.props.history.push('./app');
                                    }).catch(error => {this.setState({error: {message: 'Refill access transaction failed'}})});
                                    
                                }).catch(error => {
                                    this.setState({error: {message: 'Last refill date transaction failed, please refresh and try again'}});
                                });
                                }).catch(error => {this.setState({error: {message: 'Prescription date transaction failed'}})});
                                
                            }).catch(error => {this.setState({error: {message: 'Last prescription data transaction failed, refresh and try again'}})});
                            }).catch(error => {this.setState({error: {message: 'Dosage access transaction failed'}})});  
                        }).catch(error => {this.setState({error: {message: 'Dosage transaction failed, please refresh and try again'}})});
                    }).catch(error => {this.setState({error: {message: 'Prescription access transaction failed, please refresh and try again'}})});
                    
                }).catch(error => {this.setState({error: {message: 'Prescription transaction failed, please refresh and try again'}})});
                
                
            })
            
        }
    }

    /**
     * Checks to see that all fields that are necessary are properly filled out
     */
    checkFields() {
        firebaseApp.auth().onAuthStateChanged(user => {
            if(user) {
                this.setState({userName: user.displayName});
            }
        })
        
        if(this.state.patientName == '') {
            this.setState({error: {message: 'Please enter a patient name'}});
            return false;
        }
        else {
            if(this.state.prescription != '' && this.state.patientDosage == '') {
                this.setState({error: {message: 'Please enter a dosage for the prescribed opioid'}});
                return false;

            }
            else if(this.state.prescription == '' && this.state.patientDosage != '') {
                this.setState({error: {message: 'Please enter an opioid for the given dosage'}});
                return false;
            }
            else if(this.state.lastPrescribedDate == '') {
                this.setState({error: {message: 'Please enter the last prescribed date'}});
                return false;
            }
            else if(this.state.lastRefillDate == '') {
                this.setState({error: {message: 'Please enter the last refill date'}});
                return false;
            }
        }
        return true;
    }

    render() {
        console.log(this.state);
        firebaseApp.auth().onAuthStateChanged(user => {
            if(!user) {
                this.props.history.push('./signin');
                //makes sure that the current user is signed in befor being able to access this page
            }
            else {
                console.log(this.state.userName)
            }
            
        })
        return(
        <div>
            <h3>Enter patient information</h3>
            <form inline='true'> 
                <div className="form-group">
                    <input type="text" placeholder="Enter Patient Name (Name on Records)" className="form-control" style={{marginRight: '5px'}}
                    onChange={event => this.setState({patientName: event.target.value})}/>   
                    <input type="text" placeholder="Enter Prescribed Dosage (xx mg)" className="form-control" style={{marginRight: '5px'}}
                    onChange={event=> this.setState({patientDosage: event.target.value})}/>
                    <input type="text" placeholder="Enter Prescribed Drug" className="form-control" style={{marginRight: '5px'}}
                    onChange={event => this.setState({prescription: event.target.value})}/>
                    <input type='text' placeholder="Enter Last Prescription Date (DD/MM/YYYY)" className="form-control" style={{marginRight:'5px'}}
                    onChange={event => this.setState({lastPrescribedDate: event.target.value})}
                    />
                    <input type='text' placeholder="Enter Last Refill Date (DD/MM/YYYY)" className="form-control" syle={{marginRight: '5px'}}
                    onChange={event => this.setState({lastRefillDate: event.target.value})}/>
                    
                    <button className="btn btn-success" type="button" onClick={() =>{this.addPatientInfo()}}>
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