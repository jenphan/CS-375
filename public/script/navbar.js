document.addEventListener("DOMContentLoaded", function() {
    // Retrieve and log the cookie via JS
    const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
    console.log('User Cookie:', userCookie);

    // If user cookie is present, show the logout button
    if (userCookie) {
        document.getElementById("logout-button").style.display = "inline-block";
        const user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));

        // Check for the grade link and adjust the href based on the user's role
        const gradeLink = document.getElementById("grade-link");
        const gradeLinkContainer = document.getElementById("grade-link-container");
        if (gradeLink) {
            if (user.role !== 'student') {
                gradeLink.href = "/html/grading.html";
            } else if (user.role === "student") {
                gradeLink.href = "/html/grades.html";
            }
        }
        if (gradeLinkContainer) {
            if (user.role !== 'student') {
              gradeLinkContainer.href = "/html/grading.html";
            } else if (user.role === "student") {
              gradeLinkContainer.href = "/html/grades.html";
            }
        }
    }
});