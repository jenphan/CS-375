document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Basic validation
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    let data = {
      username: username,
      password: password,
    };

    fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.redirected) {
          // If the server redirects, follow the redirect
          window.location.href = response.url;
          return;
        }
        return response.json(); // Try to parse JSON if not redirected
      })
      .then((data) => {
        if (data && data.message) {
          alert(data.message); // Show error message if any
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  });
