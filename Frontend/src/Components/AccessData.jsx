import React, { Component } from 'react';
import { firebaseApp } from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import { DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

class AccessData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            patientName: '',
            error:{
                message:'Enter a registered patient'
            }
        };
    }

    queryData(userName, patientName){
        var query=firebaseApp.database().ref(`Users/${this.state.userName}/Patients/${this.state.patientName}`);
        console.log(query);
        var dataArr=new Array();
        query.once("value")
            .then(async snapshot => {
                await snapshot.forEach(childSnapshot => {(dataArr.unshift(childSnapshot.val()))});
            })
            .catch(() => this.setState({error: {message: 'Unexpected error'}}));
            console.log(dataArr);
            return dataArr;
    }

    displayData(dataArr){
        const list=dataArr.map( obj => {
            Object.keys(obj).map(key => {
                <li> {obj[key]} </li>
            })
        });
        console.log(list);
        return list;
    }

    render(){
        console.log(this.state);
        const displayScreen=(this.state.error.message === 'Enter a registered patient')?
        (
            <React.Fragment>
                    <h3> Enter patient name </h3>
                    <FormGroup controlId="formInLineName">
                        <ControlLabel>
                        </ControlLabel>{' '}
                        <FormControl
                            onChange={event => this.setState({ patientName: event.target.value })}
                            type="text"
                            placeholder="Name" />
                    </FormGroup>{' '}
                    <Button
                        onClick={ ()  => {
                            firebaseApp.auth().onAuthStateChanged(async user => {
                                if(user) {
                                    await this.setState({userName: user.displayName});
                                    this.setState({error: {message: `Displaying ${this.state.userName}'s patient ${this.state.patientName}'s data`}});
                                }
                            });
                        }}
                        type="submit"
                    >
                        Search Name
                </Button>
                </React.Fragment>
        ):
        (
            <div>
            {this.displayData(this.queryData(this.state.userName, this.state.patientName))}
            </div>
        );
        return(
            <div>
                {displayScreen}
                <div>{this.state.error.message}</div>
                <div><Link to="./app"> Go back to main page </Link></div>
            </div>
        );
    }
}

export default AccessData