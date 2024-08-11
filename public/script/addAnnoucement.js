document
  .getElementById("create-course-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();

    if (title && body) {
      // Store the announcement in local storage
      const announcement = { title, body, date: new Date().toLocaleString() };
      let announcements =
        JSON.parse(localStorage.getItem("announcements")) || [];
      announcements.push(announcement);
      localStorage.setItem("announcements", JSON.stringify(announcements));

      // Redirect to the announcements page
      window.location.href = "../html/announcements.html";
    }
  });
