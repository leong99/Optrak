import React, {Component} from 'react';
import { web3 } from '../Components/SignUp' //should this be imported from here?
import { firebaseApp } from '../firebase'
import { Link, BrowserRouter, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { contract } from './SignUp';

function PatientForm(props) {
    return (
        <div>
            <h3>Welcome back!</h3>
            <div><button className="btn btn-warning" onClick={() => props.history.push('./viewPatientHist')}>View your history</button></div>
            <div><button className="btn btn-success" onClick={() => props.history.push('./grantAccess')}> Grant/revoke access </button></div>
            <button className="btn btn-danger" onClick={props.onClick}>
                Sign Out
                </button>
        </div>
    )
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            status: false,
            userName: ''
        }


    }

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(async user => {
            if (user) {
                await this.setState({ userName: user.displayName });
                /*contract.then(optrakContract => {
                    optrakContract.methods.getProviderInfo(this.state.userName, optrakContract.options.from).call().then(provStatus => {
                        this.setState({ status: provStatus });
                    })
                })*/
            }
        })

    }

    signOut() {
        firebaseApp.auth().signOut();
        //signs out the user and redirects
        this.props.history.push('/signin');
    }



    render() {
        //console.log(firebaseApp.auth().currentUser);
        const user = firebaseApp.auth().onAuthStateChanged(user => {
            if (!user) {
                return this.props.history.push('/signin');
            }
            console.log(this.state);
        });



        //console.log(user);

        return (<div>
            <h3>Welcome back!</h3>
            <div><button className="btn btn-info" onClick={() => this.props.history.push('./addPatientHist')}> Add patient history</button></div>
            <div><button className="btn btn-warning" onClick={() => this.props.history.push('./viewPatientHist')}>View patient history</button></div>
            <div><button className="btn btn-success" onClick={() => this.props.history.push('./grantAccess')}> Grant access </button></div>
            <button className="btn btn-danger" onClick={() => this.signOut()}>
                Sign Out
                </button>
                </div>)



    }
}

function mapStateToProps(state) {
    console.log('state', state);
    return {}
}

export default App;