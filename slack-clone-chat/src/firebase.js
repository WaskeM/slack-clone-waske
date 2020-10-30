import firebase from "firebase";
//import * as firebase from 'firebase';
//import * as firebase from "firebase/app"
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD8XseBIslvseSstrOD_mcnYDxTbX4PbZw",
  authDomain: "my-slack-f1bca.firebaseapp.com",
  databaseURL: "https://my-slack-f1bca.firebaseio.com",
  projectId: "my-slack-f1bca",
  storageBucket: "my-slack-f1bca.appspot.com",
  messagingSenderId: "642500547413",
  appId: "1:642500547413:web:a233b640c9d2edb20095dc",
  measurementId: "G-ZG75JR2YR6"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();


export { auth, provider };
export default db;