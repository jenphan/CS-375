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

    fetch("auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Login successful") {
          alert("Login successful");
          console.log("Success:", data);
          
          const role = data.user.role;
          localStorage.setItem("userRole", role); // Store the role in localStorage
        
          if (role === "professor") {
            window.location.href = "../html/professor.html";
          } else if (role === "student") {
            window.location.href = "../html/student.html";
          } else {
            alert("Invalid role");
          }
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  });
