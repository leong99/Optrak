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


    componentDidMount() {
        //best way to get the current user's name and save it
            firebaseApp.auth().onAuthStateChanged(async user => {
                if (user) {
                   await this.setState({ userName: user.displayName });
                }
            })
            
    }

    render(){
        return(
            <div>
                {(this.state.userName==='')?
                (
                    null
                ):
                (
                    (this.queryData(this.state.userName).then(e =>{
                        console.log(e)
                        e.map(name =>{
                            <React.Fragment>
                            <div> Patient Name: {name} </div>
                            <Button
                            onClick={ () => {
                                //TODO: REDIRECT
                            
                            }
                        }
                            type="submit"
                        >
                            View information
                            </Button>
                            </React.Fragment>
                        }
                )

                })))}
            <div> {this.state.error.message} </div>
            <div><Link to="./app"> Back to main page </Link> </div>
            </div>
        )
    }
}

export default RenderPatients;