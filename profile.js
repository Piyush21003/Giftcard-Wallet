// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAE3ISmt0VVUZX-H-dy5YEn1maw9wRS-U0",
    authDomain: "giftcard-wallet-8a82f.firebaseapp.com",
    projectId: "giftcard-wallet-8a82f",
    storageBucket: "giftcard-wallet-8a82f.appspot.com",
    messagingSenderId: "204834764618",
    appId: "1:204834764618:web:6504fe9457f2a7fad733b3",
    measurementId: "G-D6PHVQ7N3S",
    databaseURL:
      "https://giftcard-wallet-8a82f-default-rtdb.firebaseio.com/",
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const database = firebase.database();

// Profile Page Data Fetch
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User logged in, show details
        document.getElementById("user-name").innerText = user.displayName || "No Name";
        document.getElementById("user-email").innerText = user.email || "No Email";
        document.getElementById("profile-img").src = user.photoURL || "default-avatar.png";
        document.getElementById("user-uid").innerText = user.uid;
        document.getElementById("last-login").innerText = user.metadata.lastSignInTime;
    } else {
        // User not logged in, redirect to index.html
        console.log("Please login");
    }
});

