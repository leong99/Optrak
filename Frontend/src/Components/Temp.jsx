import React, {Component} from 'react';
import Dropdown from 'react-dropdown';
import {firebaseApp} from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import {DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button, Checkbox} from 'react-bootstrap';
import Web3 from 'web3';
import { contract } from './SignUp';

class Temp extends Component {

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

    componentDidMount(){
      firebaseApp.auth().onAuthStateChanged(user => {
        if(user) {
          this.setState({userName: user.displayName});
        }
      })
    }
    //Calls smart contract and adds different metadata to it. This is likely not the data that we are going to be using
    //But this can be modified easily to fit any data that need be stored on the blockchain
    //Current program assumes 1 opioid prescription to a patient
    addPatientInfo = async() => {
      firebaseApp.database().ref('Users/' + this.state.userName + '/Patients/' + this.state.patientName).push({
        Dosage: this.state.patientDosage,
        Prescription: this.state.prescription,
        lastPrescribedDate : this.state.lastPrescribedDate,
        lastRefillDate : this.state.lastRefillDate
    })
    alert('Patient info added successfully. Returning to main app page');
    this.props.history.push('./app');
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

export default Temp;