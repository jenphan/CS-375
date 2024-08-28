document.addEventListener("DOMContentLoaded", function () {
  try {
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));
    if (userCookie) {
      const decodedCookie = decodeURIComponent(userCookie.split("=")[1]);
      const userData = JSON.parse(decodedCookie);
      userRole = userData.role;
      userId = userData.userid;
    } else {
      console.log("Not logged in – could not extract role from cookie");
    }
  } catch (error) {
    console.log("Error while extracting role from cookie", error);
    return;
  }

  const appointmentsContainer = document.getElementById("appointments");
  const deadlinesContainer = document.getElementById("deadlines");

  function addEvent(container, id, title, date, type) {
    const eventElement = document.createElement("div");
    eventElement.className = "calendar-event";
    if (type === "Deadline") {
      eventElement.addEventListener("click", () => {
        if (userRole === "student") {
          window.location.href = `/html/takeQuiz.html?quizID=${id}`;
        } else if (userRole === "professor") {
          window.location.href = `/html/editQuiz.html?quizID=${id}`;
        }
      });
    }
    eventElement.innerHTML = `
            <h3>${title}</h3>
            <p><strong>${type}:</strong> ${new Date(date).toLocaleString()}</p>
        `;
    container.appendChild(eventElement);
  }

  fetch("/calendar/appointments")
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        data.forEach((event) => {
          addEvent(
            appointmentsContainer,
            "",
            event.title,
            event.date,
            "Appointment",
          );
        });
      } else {
        console.error("Invalid data format for appointments");
      }
    })
    .catch((error) => {
      console.error("Error fetching appointments:", error);
    });

  fetch("/quiz/get-all")
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        data.forEach((quiz) => {
          addEvent(
            deadlinesContainer,
            quiz.quizid,
            quiz.title,
            quiz.deadline,
            "Deadline",
          );
        });
      } else {
        console.error("Invalid data format for quizzes");
      }
    })
    .catch((error) => {
      console.error("Error fetching quizzes:", error);
    });
});
