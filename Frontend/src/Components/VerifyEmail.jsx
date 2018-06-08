import React, {Component} from 'react';
import Dropdown from 'react-dropdown';
import {firebaseApp, optrakUserRef} from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import {DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';

class VerifyEmail extends Component{

    constructor(props) {
        super(props);
    }

    

    sendEmail(){ //assumes that the user is the current user
        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) {
                console.log(user);
                user.sendEmailVerification().then(() => {
                    console.log('Email sent successfully') //placeholder function
                }).catch(() => {
                    console.log('Error sending email') //also placeholder
                });
                user.reload(); 
                window.location.reload();
            }
        })
         //this check has to be in here somewhere to refresh the fact that the email was actually verified
        
        //console.log(user); //this has worked however, but this does not seem robust 
            
    }

    render() {  
        firebaseApp.auth().onAuthStateChanged(user => {
            if(user) {
                if(user.emailVerified) {
                    this.props.history.push('./app');
                }
            }
            else {
                this.props.history.push('./signin');
            }
        });
        return (
            <div>
                <h1>Please verify your email address before using Optrak</h1>
                <button className="btn btn-primary" 
                type="button"
                onClick={() => this.sendEmail()}
                >
                Resend Verification
                </button>
            </div>
            );
    }
}

export default VerifyEmail;