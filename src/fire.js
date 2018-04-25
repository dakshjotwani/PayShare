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
// Firestore TOLD ME TO
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
// Comment the line below if not working
firestore.settings(settings);

var auth = firebase.auth();
var db = firestore;
export {firebase, auth, db};
