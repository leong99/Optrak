import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import VerifyEmail from './Components/VerifyEmail';
import UpdatePatientHistory from './Components/UpdatePatientHistory';
import AddPatientHistory from './Components/AddPatientHistory';
import ViewPatientHistory from './Components/ViewPatientHistory';
import GrantAccess from './Components/GrantAccess';
import ViewLog from './Components/ViewLog';
import Temp from './Components/Temp';
import {BrowserRouter, Route, browserHistory, withRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers'
import {logUser} from './actions';


import {firebaseApp} from './firebase';
//import history from './history';

const store = createStore(reducer);
const history = createBrowserHistory();

firebaseApp.auth().onAuthStateChanged(user => {
    
    if(user) {
        console.log('user signed in/up', user);
        const email = user;
        store.dispatch(logUser(email));
        //return history.push('/app');
    }
    else {
        console.log('user has signed out, or still needs to sign in');
        //return history.push('/signin');
    }
})

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter path="/">
            <div>
                <Route path="/app" component={App} />
                <Route path="/signin" component={SignIn}/>
                <Route path="/signup" component={SignUp}/>
                <Route path="/verifyemail" component={VerifyEmail}/>
                <Route path="/updatePatientHist" component={UpdatePatientHistory}/>
                <Route path ="/addPatientHist" component={AddPatientHistory}/>
                <Route path ="/viewPatientHist" component={ViewPatientHistory}/>
                <Route path ="/grantAccess" component={GrantAccess}/>
                <Route path ="/viewLog" component={ViewLog}/>
                <Route path="/temp" component={Temp}/>
            </div>
        </BrowserRouter>
    </Provider>, document.getElementById('root')
);

