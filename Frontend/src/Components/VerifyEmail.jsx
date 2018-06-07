import React, {Component} from 'react';
import Dropdown from 'react-dropdown';
import {firebaseApp, optrakUserRef} from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import {DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';

class VerifyEmail extends Component{
    getCurrentUser(){
        firebaseApp.auth().onAuthStateChanged(function(user) {
            if (user) {
              return user;
            } else {
              // No user is signed in.
              return null;
            }
          });
    }

    sendEmail(){ //assumes that the user is the current user
        let user=this.getCurrentUser();
        console.log(user); //this does not work for some reason
        user=firebaseApp.auth().currentUser;
        user.reload(); //this check has to be in here somewhere to refresh the fact that the email was actually verified
        console.log(user); //this has worked however, but this does not seem robust
        user.sendEmailVerification().then(() => {
            console.log('Email sent successfully') //placeholder function
        }).catch(() => {
            console.log('Error sending email') //also placeholder
        });
            
    }

    render() {
        return (
                <button className="btn btn-primary" 
                type="button"
                onClick={() => this.sendEmail()}
                >
                Verify Email
                </button>
            );
    }
}

export default VerifyEmail;