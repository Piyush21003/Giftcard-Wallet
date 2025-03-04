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

  // Track Auth State
  auth.onAuthStateChanged((user) => {
    if (user) {
      document.getElementById("userName").textContent =
        user.displayName || user.phoneNumber;
      document.getElementById("dashboard").style.display = "block";
      document.getElementById("googleSignInBtn").style.display = "none";
      document.getElementById("logoutBtn").style.display = "inline-block"; // Show logout
      loadGiftCards(user.uid); // Fetch user gift cards on login
    } else {
      document.getElementById("dashboard").style.display = "none";
      document.getElementById("googleSignInBtn").style.display =
        "inline-block"; // Show sign-in
      document.getElementById("logoutBtn").style.display = "none"; // Hide logout
    }
  });

  // Google Sign-In
  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  document
    .getElementById("googleSignInBtn")
    .addEventListener("click", function () {
      auth
        .signInWithPopup(googleAuthProvider)
        .then((result) => {
          const user = result.user;
          alert("Google sign-in successful!");
        })
        .catch((error) => {
          console.error(error);
          alert("Error signing in with Google: " + error.message);
        });
    });

  // Show Add Gift Card Popup
  document
    .getElementById("addGiftCardBtn")
    .addEventListener("click", function () {
      document.getElementById("popupForm").style.display = "flex";
    });

  // Close Popup
  document
    .getElementById("closePopupBtn")
    .addEventListener("click", function () {
      document.getElementById("popupForm").style.display = "none";
    });

  // Save Gift Card
    document
    .getElementById("saveGiftCardBtn")
    .addEventListener("click", function () {
      const brand = document.getElementById("giftCardBrand").value;
      const code = document.getElementById("giftCardCode").value;
      const expiry = document.getElementById("giftCardExpiry").value;
      const pin = document.getElementById("giftCardPin").value;
      const value = document.getElementById("giftCardValue").value;
      const userId = auth.currentUser.uid;

      if (brand && code && expiry && pin && value) {
        database
          .ref("giftCards/" + userId)
          .push({
            brand: brand,
            code: code,
            expiry: expiry,
            pin: pin,
            value: value,
          })
          .then(() => {
            loadGiftCards(userId); // Gift cards reload

            //  Animation दिखाओ
            let animation = document.getElementById("successAnimation");
            animation.style.display = "block"; // Show animation
            animation.play(); // Start animation

            // 3 सेकंड बाद animation hide कर दो
            setTimeout(() => {
              animation.style.display = "none";
            }, 6000);

            document.getElementById("popupForm").style.display = "none"; // Close popup
          })
          .catch((error) => {
            console.error(error);
            alert("Error adding gift card");
          });
      } else {
        alert("Please fill in all fields");
      }
    });


  /*document
    .getElementById("saveGiftCardBtn")
    .addEventListener("click", function () {
      const brand = document.getElementById("giftCardBrand").value;
      const code = document.getElementById("giftCardCode").value;
      const expiry = document.getElementById("giftCardExpiry").value;
      const pin = document.getElementById("giftCardPin").value;
      const value = document.getElementById("giftCardValue").value; // New Field
      const userId = auth.currentUser.uid;

      if (brand && code && expiry && pin && value) {
        database
          .ref("giftCards/" + userId)
          .push({
            brand: brand,
            code: code,
            expiry: expiry,
            pin: pin,
            value: value, // New Field Stored
          })
          .then(() => {
            loadGiftCards(userId); // Reload gift cards after adding
            document.getElementById("popupForm").style.display = "none"; // Close popup
          })
          .catch((error) => {
            console.error(error);
            alert("Error adding gift card");
          });
      } else {
        alert("Please fill in all fields");
      }
    });     */

  // Load Gift Cards (Updated to Show Value)
  function loadGiftCards(userId) {
    database.ref("giftCards/" + userId).once("value", function (snapshot) {
      const giftCards = snapshot.val();
      const giftCardsContainer = document.getElementById("giftCards");
      giftCardsContainer.innerHTML = ""; // Clear existing cards
      if (giftCards) {
        for (let key in giftCards) {
          const giftCard = giftCards[key];
          const cardElement = document.createElement("div");
          cardElement.classList.add("gift-card");
          cardElement.innerHTML = `
      <h4>${giftCard.brand} Gift Card</h4>
      <p><strong>Code:</strong> ${giftCard.code} <button class="tool-btn" onclick="copyText('${giftCard.code}')"><span class="material-icons">content_copy</span></button></p>
      <p><strong>Expiry:</strong> ${giftCard.expiry} </p>
      <p><strong>Pin:</strong> ${giftCard.pin} <button class="tool-btn" onclick="copyText('${giftCard.pin}')"><span class="material-icons">content_copy</span></button></p>
      <p><strong>Value:</strong> ₹${giftCard.value}</p> <!-- Show Value -->
     
      
      <button class="tool-btn" onclick="deleteGiftCard('${key}')"><span class="material-icons">delete</span></button>
      <button class="tool-btn" onclick="shareGiftCard('${giftCard.brand}', '${giftCard.code}', '${giftCard.pin}', '${giftCard.value}')"><span class="material-icons">share</span></button>
    `;
          giftCardsContainer.appendChild(cardElement);
        }
      } else {
        giftCardsContainer.innerHTML = "<p>No gift cards found.</p>";
      }
    });
  }

  // Copy Text Function
  function copyText(text) {
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    alert("Copied to clipboard!");
  }

  // Delete Gift Card
    function deleteGiftCard(giftCardId) {
    const confirmDelete = confirm("🗂️ Remove this gift card from your wallet? Confirm to delete!");
    
    if (confirmDelete) {
        const userId = auth.currentUser.uid;
        database
            .ref("giftCards/" + userId + "/" + giftCardId)
            .remove()
            .then(() => {
                alert("✅ Gift card successfully deleted!");
                loadGiftCards(userId); // List refresh karega
            })
            .catch((error) => {
                console.error(error);
                alert("❌ Error deleting gift card: " + error.message);
            });
    }
}

  /*function deleteGiftCard(giftCardId) {
    const userId = auth.currentUser.uid;
    database
      .ref("giftCards/" + userId + "/" + giftCardId)
      .remove()
      .then(() => {
        alert("Gift card deleted");
        loadGiftCards(userId); // Reload gift cards after deletion
      })
      .catch((error) => {
        console.error(error);
        alert("Error deleting gift card");
      });
  }*/

  // Share Gift Card (Updated to Include Value)
  function shareGiftCard(brand, code, pin, value) {
    const shareText = `Gift Card Details:\nBrand: ${brand}\nCode: ${code}\nPin: ${pin}\nValue: ₹${value}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Gift Card",
          text: shareText,
        })
        .then(() => {
          alert("Gift card shared successfully!");
        })
        .catch((error) => {
          alert("Error sharing: " + error.message);
        });
    } else {
      alert("Share feature is not supported in your browser.");
    }
  }

  // Logout Button
  document
    .getElementById("logoutBtn")
    .addEventListener("click", function () {
      auth
        .signOut()
        .then(() => {
          alert("Logged out successfully!");
        })
        .catch((error) => {
          console.error(error);
          alert("Error logging out: " + error.message);
        });
    });


document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        document.getElementById("loader").style.display = "none"; // Hide loader
        document.getElementById("container").style.display = "block"; // Show main page
    }, 5000); // Loader 5 sec tak dikhega
});
