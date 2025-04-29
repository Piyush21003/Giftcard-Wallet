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

//navbar
function toggleMenu() {
            var menu = document.getElementById("mobileMenu");
            if (menu.style.display === "block") {
                menu.style.display = "none";
            } else {
                menu.style.display = "block";
            }
        }

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


//mobile-menu-bar
const menu = document.querySelector(".mobile-menu");
const menuIcon = document.querySelector(".menu-icon");
const closeBtn = document.querySelector(".close-btn");

menuIcon.addEventListener("click", () => {
    menu.classList.add("show");
});

closeBtn.addEventListener("click", () => {
    menu.classList.remove("show");
});


function removePIN() {
  const user = firebase.auth().currentUser;
  if (user) {
    const pinRef = firebase.database().ref("users/" + user.uid + "/pin");

    pinRef.remove()
      .then(() => {
        console.log("PIN removed successfully.");
        document.getElementById("message").textContent = 
          "PIN removed! Please log out and log in again to create a new PIN.";
      })
      .catch((error) => {
        console.error("Error removing PIN:", error);
        document.getElementById("message").textContent = 
          "Error removing PIN. Please try again.";
      });
  } else {
    document.getElementById("message").textContent = 
      "No user is signed in.";
  }
}
