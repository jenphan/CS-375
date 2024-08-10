document.addEventListener("DOMContentLoaded", function () {
  const appointmentsContainer = document.getElementById("appointments");
  const deadlinesContainer = document.getElementById("deadlines");

  function addEvent(container, title, date, type) {
    const eventElement = document.createElement("div");
    eventElement.className = "calendar-event";
    eventElement.innerHTML = `
            <h3>${title}</h3>
            <p>${type}: ${new Date(date).toLocaleString()}</p>
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

  fetch("/quiz/get-quizzes-calendar")
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        data.forEach((quiz) => {
          addEvent(deadlinesContainer, quiz.title, quiz.deadline, "Deadline");
        });
      } else {
        console.error("Invalid data format for quizzes");
      }
    })
    .catch((error) => {
      console.error("Error fetching quizzes:", error);
    });
});
