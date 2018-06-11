import React, {Component} from 'react';
import Dropdown from 'react-dropdown';
import {firebaseApp} from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import {DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import Web3 from 'web3';
import { contract } from './SignUp';

class UpdatePatientHistory extends Component{

    constructor(props){
        super(props);
        this.state={
            patientExists: false,
            patientName: '',
            temp: '',
            patientDosage: '',
            lastPrescribedDate: '',
            lastRefillDate: '',
            error:{
                message:''
            }
        };
    }

    searchName(name){ //checks that name exists and updates state if it does/doesn't
        contract.then(optrakContract =>{
            optrakContract.methods.getProviderMetaCount(name).call().then(
                metaCount => { console.log(metaCount);
                    if (metaCount <= 2){
                        this.setState({patientExists: false, patientName:'', error: {message: 'The given patient\'s information does not exist. Please double check your spelling.'}});
                    }
                    else{
                        this.setState({patientExists: true, patientName: name});
                    }
                }
            )
        })
        
    }

    render(){
        console.log(this.state);
        const displayScreen= (!this.state.patientExists) ?
                (
                <React.Fragment>
                <h3> Enter patient name </h3>
                <FormGroup controlId="formInLineName">
                <ControlLabel>
                </ControlLabel>{' '}
                <FormControl
                onChange={event => this.setState({temp: event.target.value})}
                type="text" 
                placeholder="Name" />
                </FormGroup>{' '}
                <Button
                onClick={()=>{
                this.searchName(this.state.temp) 
                }}
                type="submit"
                >
                Search Name
                </Button>
                </React.Fragment>
                ):(null);

        return(
            <div>
            {displayScreen}
                
            
            </div>

        )
    }
    
}

export default UpdatePatientHistory;