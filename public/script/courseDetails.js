document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const courseID = urlParams.get("courseID");

  if (courseID) {
    document.getElementById("create-quiz-link").href =
      `./createQuiz.html?courseID=${courseID}`;
  }

  try {
    const response = await fetch("/course/get-course-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: courseID }),
    });
    if (response.ok) {
      const courseResponse = await response.json();
      const course = courseResponse.course;
      if (course.title) {
        document.getElementById("course-title").textContent = course.title;
      }
      await fetchQuizzes(courseID);
    } else {
      console.log("Failed to fetch courses");
    }
  } catch (error) {
    console.log("Error fetching courses", error);
  }
});

async function fetchQuizzes(courseID) {
  try {
    const response = await fetch(`/quiz/get-all-by-course/${courseID}`);
    if (response.ok) {
      const quizzes = await response.json();
      displayQuizzes(quizzes);
    } else {
      console.log("failed to fetch quizzes");
    }
  } catch (error) {
    console.log("Error fetching quizzes", error);
  }
}

function displayQuizzes(quizzes) {
  const container = document.getElementById("container");
  quizzes.forEach((quiz) => {
    const card = document.createElement("div");
    card.className = "card";

    // create and append title
    const title = document.createElement("h2");
    title.textContent = quiz.title;
    card.append(title);

    // create and append deadline
    const deadline = document.createElement("p");
    deadline.innerHTML = `<strong>Deadline:</strong> ${new Date(quiz.deadline).toLocaleString()}`;
    card.appendChild(deadline);

    // create and append deadline
    if (quiz.timer) {
      const timer = document.createElement("p");
      timer.innerHTML = `<strong>Timer:</strong> ${convertSeconds(quiz.timer)}`;
      card.appendChild(timer);
    }

    // Only show Edit and Submissions buttons if the user is not a student
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));
    if (userCookie) {
      const decodedCookie = decodeURIComponent(userCookie.split("=")[1]);
      const userData = JSON.parse(decodedCookie);
      userRole = userData.role;
      userId = userData.userid;
    }

    if (userRole == "professor") {
      const courseCode = document.getElementById("course-code");
      courseCode.style.display = "block";
      courseCode.innerText = `Course Code: ${quiz.registrationcode}`;
      card.addEventListener("click", () => {
        window.location.href = `editQuiz.html?quizID=${quiz.quizid}`;
      });
    } else if (userRole == "student") {
      card.addEventListener("click", () => {
        window.location.href = `/html/takeQuiz.html?quizID=${quiz.quizid}`;
      });

      getQuizStatus(card, userId, quiz.quizid);
    }

    // append complete card to container
    container.appendChild(card);
  });

  if (quizzes.length === 0) {
    const emptyText = document.createElement("p");
    if (userRole === "student") {
      emptyText.innerText = "You have no upcoming quizzes at the moment!";
    } else if (userRole === "professor") {
      emptyText.innerText = "You have not created any quizzes for this course!";
    }

    container.appendChild(emptyText);
  }
}

async function getQuizStatus(card, userID, quizID) {
  try {
    const response = await fetch(`/submission/get-all-by-quizid/${quizID}`);
    if (response.ok) {
      const submissions = await response.json();
      const isCompleted = submissions.some(
        (submission) => submission.student === userID,
      );

      const status = document.createElement("p");
      status.innerHTML = `<strong>Status: </strong>`;
      if (isCompleted) {
        status.innerHTML += `<span style="color: green">Completed</span>`;
      } else {
        status.innerHTML += `<span style="color: red">Incomplete</span>`;
      }
      card.appendChild(status);
    }
  } catch (error) {
    console.log("Error fetching submissions", error);
  }
}

function convertSeconds(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const hourText = hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
  const minuteText =
    minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : "";
  const secondText =
    remainingSeconds > 0
      ? `${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`
      : "";

  if (hours > 0) {
    return `${hourText} ${minuteText} ${secondText}`;
  } else if (!hours && minutes > 0) {
    return `${minuteText} ${secondText}`;
  }
  return secondText;
}
