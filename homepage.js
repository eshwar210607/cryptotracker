import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
const auth = getAuth();
const db = getFirestore();

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout');
    logoutButton.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                localStorage.removeItem('loggedInUserId');
                window.location.href = 'login_page.html';
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    });
});

