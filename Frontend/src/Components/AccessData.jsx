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
            patients: '',
            clicked: false,
            error: {
                message: 'Enter a registered patient'
            }
        };
    }

    async queryData(userName, patientName) {
        var query = firebaseApp.database().ref(`Users/${this.state.userName}/Patients/${this.state.patientName}`);
        var dataArr = new Array();
        await query.once("value")
            .then(async snapshot => {
                await snapshot.forEach(childSnapshot => { dataArr.unshift(childSnapshot.val()); console.log(1); });
            })
            .catch(() => this.setState({ error: { message: 'Unexpected error' } }));
        console.log(dataArr);
        return dataArr;
    }

    async displayPatients() {
        var patientList = await this.queryData(this.state.userName);
        try {
            var index=0;
            this.setState({
                patients: patientList.map((obj) => {
                    return Object.keys(obj).map((key) => {
                        index++;
                        return <li key={index} className= "list-group-item"> {key}: {obj[key]} </li>;
                    }); 
                })
            })
            this.setState({clicked: false})
        }
        catch (err) {
            this.setState({ error: { message: err } });
        }
    }

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(async user => {
            if (user) {
                await this.setState({ userName: user.displayName });
            }
        })
    }

    render() {
        console.log(this.state);
        if (this.state.clicked) {
            this.displayPatients();
        }
        const displayScreen = (this.state.error.message === 'Enter a registered patient') ?
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
                        onClick={async () => {
                            await this.setState({ error: { message: `Displaying ${this.state.userName}'s patient ${this.state.patientName}'s data` } });
                            await this.setState({ clicked: true });
                        }}
                        type="submit"
                    >
                        Search Name
                </Button>
                </React.Fragment>
            ) :
            (
                null
            );
        return (
            <div>
                {displayScreen}
                {this.state.patients}
                <div>{this.state.error.message}</div>
                <div><Link to="./app"> Go back to main page </Link></div>
            </div>
        );
    }
}

export default AccessData