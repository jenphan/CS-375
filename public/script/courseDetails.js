document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseID = urlParams.get('courseID');

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
            document.getElementById('course-title').textContent = course.title;
          }
          await fetchQuizzes(courseID);
        } else {
          console.log("Failed to fetch courses");
        }
    } catch (error) {
    console.log("Error fetching courses", error);
    }
})

async function fetchQuizzes(courseID) {
  try {
    const response = await fetch (`/quiz/get-all-by-course/${courseID}`);
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
  console.log(quizzes);
  quizzes.forEach(quiz => {
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

    // Only show Edit and Submissions buttons if the user is not a student
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));
    if (userCookie.includes("professor")) {
      card.addEventListener("click", () => {
        window.location.href = `editQuiz.html?quizID=${quiz.quizid}`;
      });

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.className = "small-button";
      editButton.addEventListener("click", (event) => {
        event.stopPropagation();
        window.location.href = `editQuiz.html?quizID=${quiz.quizid}`;
      });
      card.appendChild(editButton);

      // create and append view submissions button
      const viewSubmissionsButton = document.createElement("button");
      viewSubmissionsButton.textContent = "Submissions";
      viewSubmissionsButton.className = "small-button";
      viewSubmissionsButton.addEventListener("click", (event) => {
        event.stopPropagation();
        window.location.href = `submission.html`;
      });
      card.append(viewSubmissionsButton);
    } else if (userCookie.includes("student")) {
      card.addEventListener("click", () => {
        window.location.href = `/html/takeQuiz.html?quizID=${quiz.quizid}`;
      });
    }

    // append complete card to container
    container.appendChild(card);
  })

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