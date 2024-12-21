import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
    // Your Firebase configuration goes here
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

document.addEventListener('DOMContentLoaded', () => {
    // Check the authentication state of the user
    onAuthStateChanged(auth, (user) => {
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        if (loggedInUserId) {
            const docRef = doc(db, "users", loggedInUserId);
            getDoc(docRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        document.getElementById('loggedUserName').innerText = userData.userName;
                        document.getElementById('loggedUserEmail').innerText = userData.email;
                    } else {
                        console.log("No document found matching ID");
                    }
                })
                .catch((error) => {
                    console.log("Error getting document:", error);
                });
        } else {
            console.log("User ID not found in local storage");
        }
    });

    const logoutButton = document.getElementById('logout');
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedInUserId');
        signOut(auth)
            .then(() => {
                window.location.href = 'http://127.0.0.1:5500/signup_page.html';
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    });
});
