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
          "PIN removed! Please visit mywallet_page again to create a new PIN.";
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

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const giftCardsRef = firebase.database().ref("giftCards/" + user.uid);

    giftCardsRef.once("value").then((snapshot) => {
      const data = snapshot.val();
      if (!data) {
        document.getElementById("total-cards").textContent = 0;
        document.getElementById("total-value").textContent = "₹0";
        document.getElementById("most-used-brand").textContent = "None";
        document.getElementById("recent-card").textContent = "None";
        document.getElementById("expiring-soon").textContent = "0";
        return;
      }

      const giftCards = Object.values(data);

      // Total cards
      document.getElementById("total-cards").textContent = giftCards.length;

      // Total value
      const totalValue = giftCards.reduce((sum, card) => sum + Number(card.value || 0), 0);
      document.getElementById("total-value").textContent = `₹${totalValue}`;

      // Most used brand
      const brandUsage = {};
      giftCards.forEach(card => {
        const brand = card.brand || "Unknown";
        brandUsage[brand] = (brandUsage[brand] || 0) + (card.used || 1);
      });
      const mostUsedBrand = Object.entries(brandUsage).reduce((a, b) => b[1] > a[1] ? b : a, ["None", 0]);
      document.getElementById("most-used-brand").textContent = `${mostUsedBrand[0]} (${mostUsedBrand[1]} times)`;

      // Expiring soon
      const now = new Date();
      const next7 = new Date();
      next7.setDate(now.getDate() + 7);
      const expiringSoon = giftCards.filter(card => {
        const expiry = new Date(card.expiry);
        return expiry >= now && expiry <= next7;
      });
      document.getElementById("expiring-soon").textContent = expiringSoon.length;

    }).catch(err => {
      console.error("Error fetching gift cards:", err);
    });
  }
});

// Chat Support Mail Link Setup
setTimeout(() => {
  const name = document.getElementById("user-name").innerText;
  const email = document.getElementById("user-email").innerText;
  const uid = document.getElementById("user-uid").innerText;

  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nUser ID: ${uid}\n\nMessage: `);
  const href = `mailto:playmaxxserver@gmail.com?subject=Chat%20Support&body=${body}`;
  document.getElementById("chatSupportLink").href = href;
}, 1000); 
