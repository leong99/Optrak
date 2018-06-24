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
            error: {
                message: ''
            }
        }


    }

    async queryData(userName){
        var query=firebaseApp.database().ref(`Users/${this.state.userName}`);
        var dataArr=new Array();
        await query.once("value")
            .then(async snapshot => {
                await snapshot.forEach(childSnapshot => {dataArr.unshift(childSnapshot.val()); console.log(1);});
            })
            .catch(() => this.setState({error: {message: 'Unexpected error'}}));
        console.log(dataArr);
        return dataArr;
    }

    displayData(array){
        var list;
        console.log(array);
        for (var item in array){
            list+=<li> {item} </li>;
        }
        console.log(list, 'list is here');
        return list;
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
        console.log(this.state);    
        firebaseApp.auth().onAuthStateChanged(user => {
            if (!user) {
                this.props.history.push('./signin');
            }
        })
        if (this.state.userName !== ''){
            console.log('test');
            var patientArr=async () => await this.queryData(this.state.userName);
        }
        const displayObject=(this.state.userName === '')?
        (
            null
        ):
        (
            <div> {this.displayData(patientArr)} </div>
        );
        return(
            <div>
            {displayObject}
            <div> {this.state.error.message} </div>
            <div><Link to="./app"> Back to main page </Link> </div>
            </div>
        )
    }
}

export default RenderPatients;