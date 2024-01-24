import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCLtxjLCIv0N1LaU2yw1fkEhFTjLF9bj5A",
    authDomain: "petpar-80548.firebaseapp.com",
    projectId: "petpar-80548",
    storageBucket: "petpar-80548.appspot.com",
    messagingSenderId: "770119560640",
    appId: "1:770119560640:web:3d23e976b0428d2d35ac25",
    measurementId: "G-MC92VLE3GE"
};

firebase.initializeApp(firebaseConfig);

export default firebase;