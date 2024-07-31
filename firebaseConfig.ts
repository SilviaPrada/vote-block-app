import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAg81y1Q9o_xMglt0O7In73lTKqM72BHtY",
    authDomain: "vote-block-5e13d.firebaseapp.com",
    databaseURL: "https://vote-block-5e13d-default-rtdb.firebaseio.com",
    projectId: "vote-block-5e13d",
    storageBucket: "vote-block-5e13d.appspot.com",
    messagingSenderId: "804757080867",
    appId: "1:804757080867:web:193c9d6d9351dbebffda96",
    measurementId: "G-935W1QLHR4"
};

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };