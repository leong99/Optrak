import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyACP5w1EOqY71AKm3r73lP276hAAOpcd44",
    authDomain: "optrak-795ed.firebaseapp.com",
    databaseURL: "https://optrak-795ed.firebaseio.com",
    projectId: "optrak-795ed",
    storageBucket: "optrak-795ed.appspot.com",
    messagingSenderId: "864155166856"
  };

  export const firebaseApp = firebase.initializeApp(config);
  export const optrakUserRef = firebase.database().ref('Users');
