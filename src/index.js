import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth'; 
import {BrowserRouter} from 'react-router-dom';



var config = {
    apiKey: "AIzaSyBKD5L_xvk9xqjaJIVzYo1jwZA6jcULdRE",
    authDomain: "info-343-doggie-tinder.firebaseapp.com",
    databaseURL: "https://info-343-doggie-tinder.firebaseio.com",
    projectId: "info-343-doggie-tinder",
    storageBucket: "",
    messagingSenderId: "259039318573"
  };
firebase.initializeApp(config);
ReactDOM.render(<BrowserRouter basename={process.env.PUBLIC_URL+'/'}><App /></BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
