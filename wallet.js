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
      `Welcome ${user.displayName || user.phoneNumber}`;
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("googleSignInBtn").style.display = "none";
    document.getElementById("logoutBtn").style.display = "inline-block"; // Show logout
    handlePostLogin(user); // <-- Giftcards se pehle PIN ka kaam hoga
  } else {
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("googleSignInBtn").style.display = "inline-block"; // Show sign-in
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

          // ✅ Clear the form fields
          document.getElementById("giftCardBrand").value = "";
          document.getElementById("giftCardCode").value = "";
          document.getElementById("giftCardExpiry").value = "";
          document.getElementById("giftCardPin").value = "";
          document.getElementById("giftCardValue").value = "";

          // ✅ Optional: If using a form tag, you could also use:
          // document.getElementById("yourFormId").reset();

          // ✅ Animation दिखाओ
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
          const expiryBadge = highlightExpiry(cardElement, giftCard.expiry); // 🔥 Get badge HTML
          cardElement.innerHTML = `
      <h4>${giftCard.brand} Gift Card</h4>
      <p><strong>Code:</strong> ${giftCard.code} <button class="tool-btn" onclick="copyText('${giftCard.code}')"><span class="material-icons">content_copy</span></button></p>
      <p><strong>Expiry:</strong> ${giftCard.expiry} </p>
      <p><strong>Pin:</strong> ${giftCard.pin} <button class="tool-btn" onclick="copyText('${giftCard.pin}')"><span class="material-icons">content_copy</span></button></p>
      <p><strong>Value:</strong> ₹${giftCard.value}</p> <!-- Show Value -->
     
      
      <button class="tool-btn" onclick="deleteGiftCard('${key}')"><span class="material-icons">delete</span></button>
      <button class="tool-btn" onclick="shareGiftCard('${giftCard.brand}', '${giftCard.code}', '${giftCard.pin}', '${giftCard.value}')"><span class="material-icons">share</span></button>${expiryBadge} <!-- 🔥 Insert badge here -->
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
          sessionStorage.removeItem("pinVerified");
          
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
    }, 4000); // Loader 5 sec tak dikhega
});

//searchbar
document.getElementById("searchGiftCard").addEventListener("input", function () {
    let filter = this.value.toLowerCase();
    let giftCards = document.querySelectorAll(".gift-card");

    giftCards.forEach((card) => {
        let brand = card.querySelector("h4").textContent.toLowerCase();
        let code = card.querySelector("p:nth-child(2)").textContent.toLowerCase();

        if (brand.includes(filter) || code.includes(filter)) {
            card.style.display = "block"; // Show matching cards
        } else {
            card.style.display = "none"; // Hide non-matching cards
        }
    });
});

//navbar
function toggleMenu() {
            var menu = document.getElementById("mobileMenu");
            if (menu.style.display === "block") {
                menu.style.display = "none";
            } else {
                menu.style.display = "block";
            }
        }

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



//giftcard_pdf_download
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const downloadPDF = params.get('download');

  if (downloadPDF === 'pdf') {
    const waitForGiftcards = setInterval(() => {
      const giftcards = document.querySelectorAll('#giftCards .gift-card');

      if (giftcards.length > 0) {
        clearInterval(waitForGiftcards);

        setTimeout(() => {
          const container = document.getElementById('giftCards');
          html2pdf().set({
            margin: 0.5,
            filename: 'MyGiftcards.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
          }).from(container).save();
        }, 500);
      }
    }, 300);
  }
}); 



function handlePostLogin(user) {
    if (sessionStorage.getItem("pinVerified") === "true") {
  console.log("✅ PIN already verified this session, skipping popup");
  loadGiftCards(user.uid); // Load giftcards directly
  return;
}
  const userId = user.uid;
  const userRef = database.ref("users/" + userId);

  userRef.once("value")
    .then((snapshot) => {
      if (snapshot.exists() && snapshot.val().pin) {
        // Old user, ask for PIN verification
        document.getElementById("pinVerifyForm").style.display = "flex";

        const verifyButton = document.getElementById("verifyPinBtn");
        verifyButton.onclick = function () {
          const enteredPin = document.getElementById("verifyPinInput").value;
          if (enteredPin === snapshot.val().pin) {
            alert("✅ PIN verified successfully!");
            sessionStorage.setItem("pinVerified", "true");
            document.getElementById("pinVerifyForm").style.display = "none";
            loadGiftCards(userId); // Load giftcards after PIN verified
          } else {
            alert("❌ Incorrect PIN! Please try again.");
          }
        };
        
      } else {
        // New user, ask to create a PIN
        document.getElementById("pinCreateForm").style.display = "flex";

        const saveButton = document.getElementById("savePinBtn");
        saveButton.onclick = function () {
          const newPin = document.getElementById("createPinInput").value;
          if (newPin.length >= 4) {
            userRef.set({ pin: newPin })
              .then(() => {
                alert("✅ PIN created successfully!");
                sessionStorage.setItem("pinVerified", "true");
                document.getElementById("pinCreateForm").style.display = "none";
                loadGiftCards(userId); // Load giftcards after PIN created
              })
              .catch((error) => {
                console.error(error);
                alert("Error saving PIN: " + error.message);
              });
          } else {
            alert("❗ PIN must be at least 4 digits!");
          }
        };
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Error checking PIN: " + error.message);
    });
}

//expiryhighlight
function highlightExpiry(cardElement, expiryDateStr) {
  const expiryDate = new Date(expiryDateStr);
  const today = new Date();

  expiryDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));

  let badge = ""; // Empty by default

  if (daysDiff < 0) {
    // Expired
    cardElement.style.border = "2px solid red";
    badge = `<span class="badge expired">❌ Expired</span>`;
  } else if (daysDiff <= 7) {
    // Expiring Soon
    cardElement.style.border = "2px solid #ff9800";
    badge = `<span class="badge expiring">⚠️ Expiring Soon</span>`;
  }

  return badge; // Return badge HTML
}
