// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9Z4GoIRONE5tspl7w0fvJTUEMIxPcL4Q",
  authDomain: "cryptotracker-21.firebaseapp.com",
  projectId: "cryptotracker-21",
  storageBucket: "cryptotracker-21.firebasestorage.app",
  messagingSenderId: "342349615474",
  appId: "1:342349615474:web:ede4801d1f6e5cd4ec0deb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message, divId){
  var messageDiv=document.getElementById(divId);
  messageDiv.style.display="block";
  messageDiv.innerHTML=message;
  messageDiv.style.opacity=1;
  setTimeout(function(){
    messageDiv.style.opacity=0;
  },5000);
}

const signUp=document.getElementById('submitsignup');
signUp.addEventListener('click',(event)=>{
  event.preventDefault();
  const email=document.getElementById('email').value;
  const password=document.getElementById('password').value;
  const userName=document.getElementById('username').value;

  const auth=getAuth();
  const db=getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential)=>{
    const user=userCredential.user;
    const userData={
      email: email,
      userName: userName
    };
    showMessage('Account Created Successfully', 'signUpMessage');
    const docRef=doc(db, "users", user.uid);
    setDoc(docRef,userData)
    .then(()=>{
      window.location.href='http://127.0.0.1:5500/login_page.html';
    })
    .catch((error)=>{
      console.error("error writing document", error);
      
    });
  })
  .catch((error)=>{
    const errorCode=error.code;
    if(errorCode=='auth/email-already-in-use'){
      showMessage('Email Adress Already Exists !!!', 'signUpMessage');
    }
    else{
      showMessage('unable to create user', 'signUpMessage');
    }
  })
})
