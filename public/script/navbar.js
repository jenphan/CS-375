document.addEventListener("DOMContentLoaded", function () {
  // Retrieve and log the cookie via JS
  const userCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user="));
  console.log("User Cookie:", userCookie);

  // If user cookie is present, show the logout button and adjust UI elements based on role
  if (userCookie) {
    document.getElementById("logout-button").style.display = "inline-block";
    const user = JSON.parse(decodeURIComponent(userCookie.split("=")[1]));

    // Check for the grade link and adjust the href based on the user's role
    const gradeLink = document.getElementById("grade-link");
    const gradeLinkContainer = document.getElementById("grade-link-container");
    if (gradeLink) {
      if (user.role === "professor") {
        gradeLink.href = "/html/submission.html";
      } else if (user.role === "student") {
        gradeLink.href = "/html/grades.html";
      }
    }
    if (gradeLinkContainer) {
      if (user.role === "professor") {
        gradeLinkContainer.href = "/html/submission.html";
      } else if (user.role === "student") {
        gradeLinkContainer.href = "/html/grades.html";
      }
    }

    // Hide elements based on user role on quiz page
    if (user.role === "student") {
      document.getElementById("add-new-post").style.display = "none";
      document.getElementById("see-submissions").style.display = "none";
    }
  }
});
