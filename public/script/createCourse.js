document
  .getElementById("create-course-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting

    const courseName = document.getElementById("course-name").value.trim();
    const subjectCode = document.getElementById("subject-code").value.trim();
    const courseNumber = document.getElementById("course-number").value.trim();
    const crn = document.getElementById("crn").value.trim();

    // Validation logic
    if (!courseName || !subjectCode || !courseNumber || !crn) {
      alert("Please fill in all fields");
      return false;
    }
    if (courseName.length > 50) {
      alert("Course name is too long");
      return false;
    }
    if (subjectCode.length > 6) {
      alert("Subject code is too long");
      return false;
    }
    if (courseNumber.length !== 3) {
      alert("Course number is not 3 digits");
      return false;
    }
    if (crn.length !== 5) {
      alert("CRN must be 5 digits");
      return false;
    }

    // Create data object
    let data = {
      courseName: courseName,
      subjectCode: subjectCode,
      courseNumber: courseNumber,
      crn: crn,
    };

    console.log("Sending data to server:", data);

    // Send POST request
    fetch("/course/create-course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Network response was not ok");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        alert("Course created successfully!");
        window.location.href = "./professor.html";
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(`Course creation failed: ${error.message}`);
      });
  });
