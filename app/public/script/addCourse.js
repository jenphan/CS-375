document.addEventListener("DOMContentLoaded", function () {
  const addCourseButton = document.getElementById("add-course");
  const inputContainer = document.getElementById("inputContainer");

  addCourseButton.addEventListener("click", function () {
    if (inputContainer.classList.contains("hidden")) {
      inputContainer.classList.remove("hidden");
    } else {
      inputContainer.classList.add("hidden");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const courseCodeInput = document.getElementById("course-code");
  const username = data.user.username;

  inputField.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      const courseCode = courseCodeInput.value.trim();
      if (courseCode) {
        enroll(username, courseCode);
      }
    }
  });
});
