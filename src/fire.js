import firebase from 'firebase'
import 'firebase/firestore'

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAZ8is2W6ia0CoP0TC544ali49u1CkpZNg",
  authDomain: "payshareapp.firebaseapp.com",
  databaseURL: "https://payshareapp.firebaseio.com",
  projectId: "payshareapp",
  storageBucket: "payshareapp.appspot.com",
  messagingSenderId: "445814351777"
};

firebase.initializeApp(config);
var auth = firebase.auth();
var firestore = firebase.firestore();
var db = firestore;
export {firebase, auth, db};
// ... or you can use the equivalent shorthand notation
// var defaultStorage = firebase.storage();
// var defaultDatabase = firebase.database();
