import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
<<<<<<< HEAD
import {BrowserRouter, Route, browserHistory, withRouter} from 'react-router-dom';
=======
import Temp from './Components/Temp';
import {BrowserRouter, Route, browserHistory} from 'react-router-dom';
>>>>>>> 258e27254dcea645f3db697585482c621768c939
import {firebaseApp} from './firebase';
import history from './history';

firebaseApp.auth().onAuthStateChanged(user => {
    
    if(user) {
        console.log('user signed in/up', user);
        history.push('/app');
    }
    else {
        console.log('user has signed out, or still needs to sign in');
        history.push('/signin');
    }
})

ReactDOM.render(
    <BrowserRouter path="/">
        <div>
            <Route path="/app" component={App} />
            <Route path="/signin" component={SignIn}/>
            <Route path="/signup" component={SignUp}/>
            <Route path="/temp" component={Temp}/>
        </div>
    </BrowserRouter>, document.getElementById('root')
);

