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
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Call the function to check session state
checkUserLoggedIn();
