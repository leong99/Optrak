import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import { firebaseApp } from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import { DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button, Checkbox } from 'react-bootstrap';
import Web3 from 'web3';
import { contract } from './SignUp';


class RenderPatients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            patients: '',
            error: {
                message: ''
            }
        }
    }

    async queryData(userName){
        var query=firebaseApp.database().ref(`Users/${this.state.userName}/Patients`);
        var dataArr=new Array();
        var self=this;
        await query.once("value")
            .then(async snapshot => {
                await snapshot.forEach(childSnapshot => {dataArr.unshift(childSnapshot.key); console.log(1);});
            })
            .catch(() => this.setState({error: {message: 'Unexpected error'}}));
        console.log(dataArr);
        return dataArr;
    }

    renderPatientList = async () =>{
        try{
            let patientArr = await this.queryData(this.state.userName);
            this.setState({
                patients: patientArr.map((name, index) => {
                    return <li key={index} className= "list-group-item">{name} <Button onClick ={null /*put blockchain link here*/} type="submit"> View Patient </Button></li>
                })
            });
        }
        catch (err){
            console.log(err);
            this.setState({error: {message: err}});
        }
    }


    componentDidMount() {
        //best way to get the current user's name and save it
            firebaseApp.auth().onAuthStateChanged(async user => {
                if (user) {
                console.log('got here');
                   await this.setState({ userName: user.displayName });
                   console.log(this.state.userName, 'real check');
                   this.renderPatientList();
                    console.log(this.state);
                }
            })
                
            
            
    }

    render(){
        console.log(this.state);
        return(
            <div>
                {this.state.patients}
            <div> {this.state.error.message} </div>
            <div><Link to="./app"> Back to main page </Link> </div>
            </div>
        )
    }
}

export default RenderPatients;