document.addEventListener("DOMContentLoaded", function () {
  let courses = [];

  fetch("/course/current-courses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
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
      if (data.courses.length > 0) {
        for (let i = 0; i < data.courses.length; i++) {
          let obj = {
            title: data.courses[i].title,
            image: "../picture/dataStructures.jpg",
            link: "../html/activeCourses/dataStructures.html",
          };
          courses.push(obj);
        }
        displayCourses();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`Course display error: ${error.message}`);
    });

  console.log("courses (outside function):" + courses);

  let courseList = document.getElementById("courseList");

  function displayCourses() {
    console.log("courses (inside function):" + courses);
    courses.forEach((course) => {
      let courseBox = document.createElement("div");
      courseBox.className = "course-box";
      courseBox.onclick = () => (window.location.href = course.link);

      let img = document.createElement("img");
      img.src = course.image;
      img.alt = course.title;

      let title = document.createElement("div");
      title.className = "course-title";
      title.textContent = course.title;

      courseBox.appendChild(img);
      courseBox.appendChild(title);
      courseList.appendChild(courseBox);
    });
  }
});
