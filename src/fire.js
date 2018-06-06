import firebase from 'firebase';
import 'firebase/firestore';

// Initialize Firebase
let config = {
  apiKey: 'AIzaSyAZ8is2W6ia0CoP0TC544ali49u1CkpZNg',
  authDomain: 'payshareapp.firebaseapp.com',
  databaseURL: 'https://payshareapp.firebaseio.com',
  projectId: 'payshareapp',
  storageBucket: 'payshareapp.appspot.com',
  messagingSenderId: '445814351777',
};

firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

let auth = firebase.auth();
let db = firestore;

export {firebase, auth, db};
