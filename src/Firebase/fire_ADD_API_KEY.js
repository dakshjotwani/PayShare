import firebase from 'firebase';
import 'firebase/firestore';

/*
 * Steps to setup firebase:
 * 1. Get config variable below from your firebase console
 * 2. rename this file to fire.js
 */

// Initialize Firebase
let config = {
  apiKey: 'YOUR_API_KEY_HERE',
  authDomain: 'PROJECT_ID.firebaseapp.com',
  databaseURL: 'https://PROJECT_ID.firebaseio.com',
  projectId: 'PROJECT_ID',
  storageBucket: 'PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
};

firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

let auth = firebase.auth();
let db = firestore;

export {firebase, auth, db};
