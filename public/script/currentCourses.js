document.addEventListener("DOMContentLoaded", function () {
  let courses = [
    /*{
      title: "Web Development",
      image: "../picture/webDev.jpg",
      link: "./webDev.html",
    },
    {
      title: "Data Structures",
      image: "../picture/dataStructures.jpg",
      link: "./dataStructures.html",
    }, */
    // Add more courses as needed
  ];

  fetch("/course/current-courses" , {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  }).then((response) => {
    if (!response.ok) {
      return response.json().then((errorData) => {
        throw new Error(errorData.message || "Network response was not ok");
      });
    }
    return response.json();
  }).then((data) => {
    //console.log(data);
    for (let i = 0; i < data.length; i++){
      let obj = { 
        title: data[i].title,
        image: "../picture/dataStructures.jpg",
        link: "./dataStructures.html"
      };
      console.log("object: (inside fetch)" + object);
      courses.push(obj);
    }
    displayCourses();
  }).catch( (error) => {
    console.error("Error:", error);
    alert(`Course display error: ${error.message}`);
  });
  
  
  
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
    title.className = "title";
    title.textContent = course.title;

    courseBox.appendChild(img);
    courseBox.appendChild(title);
    courseList.appendChild(courseBox);
  });
  }
  




});
