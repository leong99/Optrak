import React, { Component } from 'react';
import { firebaseApp } from '../firebase';

class AccessData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            patientName: '',
            error:{
                message:''
            }
        };
    }

    displayData(userName, patientName){

    }

    render(){
        console.log(this.state);
        const displayScreen=(this.state.error.message === '')?
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
                        onClick={() => {
                            firebaseApp.auth().onAuthStateChanged(user => {
                                if(user) {
                                    this.setState({userName: user});
                                }
                            });
                            this.setState({error: {message: `Displaying ${this.state.userName}'s patient ${this.state.patientName}'s data`}});
                        }}
                        type="submit"
                    >
                        Search Name
                </Button>
                </React.Fragment>
        ):
        (
            null
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