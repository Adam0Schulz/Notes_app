// Import the functions you need from the SDKs you need
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env'
import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID
};

if (firebase.apps.length === 0) {

  firebase.initializeApp(firebaseConfig)
} else {
  firebase.app()
}

const auth = firebase.auth()
const firestore = firebase.firestore()
const notesRef = firestore.collection('notes')

export { firebase, auth, firestore, notesRef }