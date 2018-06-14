import React, {Component} from 'react';
import { web3 } from '../Components/SignUp' //should this be imported from here?
import { firebaseApp } from '../firebase'
import { Link, BrowserRouter, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { contract } from './SignUp';



class App extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            status: ''
        }
    }

    signOut() {
        firebaseApp.auth().signOut();
        //signs out the user and redirects
        this.props.history.push('/signin');
    }

    

    render() {
        console.log(firebaseApp.auth().currentUser);
        const user = firebaseApp.auth().onAuthStateChanged(user => {
           if(!user) {
               return this.props.history.push('/signin');
           }
        });
        console.log(user);
            
            return(<div> 
                    <h3>Welcome back!</h3>
                    <div><button className="btn btn-info" onClick={() => this.props.history.push('./addPatientHist')}> Add patient history</button></div>
                    <div><button className="btn btn-primary" onClick={() => this.props.history.push('./updatePatientHist')}> Update patient history</button></div>
                    <div><button className="btn btn-warning" onClick={() => this.props.history.push('./viewPatientHist')}>View patient history</button></div>
                    <div><button className="btn btn-success" onClick={() => this.props.history.push('./grantAccess')}> Grant access </button></div> 
                <button className="btn btn-danger" onClick={() => this.signOut()}>
                Sign Out
                </button>
    
                </div>);

}
}

function mapStateToProps(state) {
    console.log('state', state);
    return {}
}

export default connect(mapStateToProps, null)(App);