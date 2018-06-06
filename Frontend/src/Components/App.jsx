import React, {Component} from 'react';
import { web3 } from '../Components/SignUp'
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
        this.props.history.push('/signin');
    }

    render() {
        const user = firebaseApp.auth().onAuthStateChanged(user => {
           if(!user) {
               return this.props.history.push('/signin');
           }
        });
        console.log(user);
            
            return(<div> App 
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