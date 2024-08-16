document.addEventListener("DOMContentLoaded", function () {
  const courses = [
    {
      title: "Web Development",
      image: "../picture/webDev.jpg",
      link: "./webDev.html",
    },
    {
      title: "Data Structures",
      image: "../picture/dataStructures.jpg",
      link: "./dataStructures.html",
    },
    // Add more courses as needed
  ];

  const courseList = document.getElementById("courseList");

  courses.forEach((course) => {
    const courseBox = document.createElement("div");
    courseBox.className = "course-box";
    courseBox.onclick = () => (window.location.href = course.link);

    const img = document.createElement("img");
    img.src = course.image;
    img.alt = course.title;

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = course.title;

    courseBox.appendChild(img);
    courseBox.appendChild(title);
    courseList.appendChild(courseBox);
  });
});
