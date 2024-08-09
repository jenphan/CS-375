document
  .getElementById("schedule-appointment-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting

    const title = document.getElementById("appointment-title").value.trim();
    const date = document.getElementById("appointment-date").value.trim();

    if (!title || !date) {
      alert("Please fill in all fields");
      return false;
    }

    let data = {
      title: title,
      date: date,
    };

    console.log("Sending data to server:", data);

    // Send POST request
    fetch("/calendar/appointments", {
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
        alert("Appointment scheduled successfully!");
        window.location.href = "./calendar.html";
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(`Scheduling failed: ${error.message}`);
      });
  });
