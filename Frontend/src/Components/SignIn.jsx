import React, {Component} from 'react';
import {firebaseApp} from '../firebase';
import { Link, BrowserRouter, Route } from 'react-router-dom';

class SignIn extends Component {
    constructor(props){
        super(props);
        this.state={
            email: '',
            password: '',
            error:{
                message:''
            }
        }
    }
    signIn = async() => {
        console.log('this.state', this.state);
        const {email, password}=this.state;
        firebaseApp.auth().signInWithEmailAndPassword(email, password).then(user => {
            if(user.emailVerified) {
                this.props.history.push('./app');
            }
            else {
                this.props.history.push('./verifyemail');
            }
            
        }).catch(error => {
            this.setState({error});
        });
    }

    render() {
        return (
            <form inline="true">
                <h2>Sign in to Optrak</h2>
                <div className="form-group">
                    <input
                     className="form-control" 
                     type="text" 
                     placeholder="Email Address"
                     onChange={event => this.setState({email: event.target.value})}/>
                     <input
                     className="form-control" 
                     type="password" 
                     placeholder="Password"
                     onChange={event => this.setState({password: event.target.value})}/>
                    <button className="btn btn-primary" 
                    type="button"
                    onClick={() => this.signIn()}
                    >
                    Sign In
                    </button>
                </div>
                <div>{this.state.error.message}</div>
                <div><Link to={'/signup'}> Sign up instead </Link> </div>
            </form>
            );
    }
}

export default SignIn;