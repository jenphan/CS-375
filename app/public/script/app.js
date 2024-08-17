// Handle the Create Account button click
const createAccountButton = document.querySelector(".create-account-button");
if (createAccountButton) {
  createAccountButton.addEventListener("click", function () {
    window.location.href = "../html/register.html";
  });
}

// Function to check if the user is logged in
function checkUserLoggedIn() {
  fetch("/auth/check-session", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.loggedIn) {
        document.getElementById("logout-button").style.display = "inline-block";
        const loginContainer = document.querySelector(".login-container");
        if (loginContainer) {
          loginContainer.style.display = "none";
        }
      } else {
        // If the user is not logged in, redirect to the home page
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    })
    .catch((error) => {
      console.error("Error checking login status:", error);
      // Optionally, redirect to the home page in case of an error
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    });
}

// Only run the session check on protected pages (like professor.html or student.html)
if (window.location.pathname.includes("professor.html") || window.location.pathname.includes("student.html")) {
  checkUserLoggedIn();
}
