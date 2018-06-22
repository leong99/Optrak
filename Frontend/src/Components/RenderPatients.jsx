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

class RenderPatients extends Component {
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
                }
            })
    }

    render(){
        firebaseApp.auth().onAuthStateChanged(user => {
            if (!user) {
                this.props.history.push('./signin');
            }
        })
        return(
            <div> Test </div>
        )
    }
}

export default RenderPatients;