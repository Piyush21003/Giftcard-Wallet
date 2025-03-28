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
