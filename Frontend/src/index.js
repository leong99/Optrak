import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import VerifyEmail from './Components/VerifyEmail';
import UpdatePatientHistory from './Components/UpdatePatientHistory';
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
                <Route path="/updatepatienthistory" component={UpdatePatientHistory}/>
            </div>
        </BrowserRouter>
    </Provider>, document.getElementById('root')
);

