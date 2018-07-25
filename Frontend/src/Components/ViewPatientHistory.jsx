import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import { firebaseApp } from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import { DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button, Checkbox } from 'react-bootstrap';
import Web3 from 'web3';
import { contract } from './SignUp';
import jwt from 'jsonwebtoken';
const EXPIRYTIME = '1m';


class ViewPatientHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            patients: '',
            patientInfo: '',
            clicked: false,
            error: {
                message: ''
            },
            jsonToken: '',
            signedKey: ''
        }
    }

    //This method queries the list of patients and converts it into an array
    //pre: username parameter is the username of the provider whose patients we want to query
    //post: returns array (as result of promise) of provider's patients
    async queryPatients(userName) {
        var query = firebaseApp.database().ref(`Users/${userName}/Patients`);
        var dataArr = new Array();
        await query.once("value")
            .then(async snapshot => {
                await snapshot.forEach(childSnapshot => { dataArr.unshift(childSnapshot.key) });
            })
            .catch(() => this.setState({ error: { message: 'Unexpected error' } }));
        console.log(dataArr);
        return dataArr;
    }

    //This method queries the data of a particular patient and converts it into an array
    //pre: patientName parameter is the name of the patient under the provider (here as username) whose data we want to query
    //post: returns array (as result of promise) of the patient's data
    async queryPatientData(userName, patientName) {
        var query = firebaseApp.database().ref(`Users/${userName}/Patients/${patientName}`);
        var dataArr = new Array();
        await query.once("value")
            .then(async snapshot => {
                await snapshot.forEach(childSnapshot => { dataArr.unshift(childSnapshot.val()) });
            })
            .catch(() => this.setState({ error: { message: 'Unexpected error' } }));
        console.log(dataArr);
        return dataArr;
    }

    //This method converts the array of patients into a list whose buttons access each patient's data
    //pre: pantientsList parameter is the array of patients of the provider
    //post: returns list of patients with buttons that redirect to displaying their data
    async renderPatientList(patientsList) {
        try {
            let patientArr = await patientsList;
            this.setState({
                patients: patientArr.map((name, index) => {
                    return <li key={index} className="list-group-item">{name} <Button className="btn btn-info" onClick={async () => { await this.displayPatientData(this.queryPatientData(this.state.userName, name)); this.setState({ clicked: true }); }} type="submit"> View Patient Info </Button> </li>
                })
            });
        }
        catch (err) {
            console.log(err);
            this.setState({ error: { message: err } });
        }
    }

    //This method converts an array of a particular patient's data into a list
    //pre: patientData parameter is the array of data of a particular patient
    //post: returns list of patient data
    async displayPatientData(patientData) {
        try {
            var patientList = await patientData;
            var token = jwt.sign(
                {
                    patientInfo: patientList
                },
                'foo',
                { expiresIn: EXPIRYTIME }
            )
            this.setState({ jsonToken: token });
            console.log(token);
        }
        catch (err) {
            this.setState({ error: { message: err } });
        }
    }

    //Decodes token using secret key
    verifyToken(e){
        e.preventDefault();
        jwt.verify(this.state.jsonToken, this.state.signedKey, async (err, decoded) => {
            console.log(this.state.jsonToken, this.state.signedKey);
            if (err){
                console.log('error occured verifying');
                this.setState({patientInfo: ''});
                this.setState({error: {message: 'Error occured authenticating JSON web token. Token has either timed out, or the key provided is incorrect.'}})
                //Should also change the rendering screen based on whether token was properly verified or not
            }
            else{
                console.log('ran properly');
                var patientArr = await decoded.patientInfo;
                console.log(patientArr);
                var index = 0;
                this.setState({patientInfo: patientArr.map((obj) => {
                    return Object.keys(obj).map((key) => {
                        index++;
                        return <li key={index} className="list-group-item"> {key}: {obj[key]} </li>;
                    });
                })});
                this.setState({error: {message: ''}});
            }
        })
    }


    componentDidMount() {
        //best way to get the current user's name and save it
        firebaseApp.auth().onAuthStateChanged(async user => {
            if (user) {
                console.log('got here');
                await this.setState({ userName: user.displayName });
                console.log(this.state.userName, 'real check');
                await this.renderPatientList(this.queryPatients(this.state.userName));
                console.log(this.state);
            }
        })



    }

    render() {
        console.log(this.state);
        const displayScreen = (this.state.clicked) ?
            (
                <React.Fragment>
                <div>
                    {this.state.patientInfo}
                    <Button
                        className="btn btn-warning"
                        onClick={() => {
                            this.setState({ clicked: false }); //changes render to list of patients for that user
                        }
                        } type="submit"
                        >
                        View Another Patient
                        </Button>
                </div>

                

                <div>
                <h3>Grant patient access to another provider</h3>
                <form inline="true">
                    {/*<input type="text" placeholder="Enter token" className="form-control" style={{ marginRight: '5px' }}
                        onChange={event => this.setState({ jsonToken: event.target.value.trim() })} />*/}
                    <input type="text" placeholder="Enter secret key" className="form-control" style={{ marginRight: '5px' }}
                        onChange={event => this.setState({ signedKey: event.target.value.trim() })} />
                    <button className="btn btn-warning" onClick={e => this.verifyToken(e)}> Verify Token </button>
                    
                </form>
                </div>
                </React.Fragment>
            )
            :
            (
                <div>
                    {this.state.patients}
                </div>
            )
        return (
            <div>
                {displayScreen}
                <div> {this.state.error.message} </div>
                <div><Link to="./app"> Back to main page </Link> </div>
            </div>
        )
    }
}

export default ViewPatientHistory;