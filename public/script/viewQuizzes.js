document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/quiz/get-all-by-user");
    const quizzes = await response.json();

    const submissionsResponse = await fetch("/submission/get-all-by-user");
    const submissions = await submissionsResponse.json();

    displayQuizzes(quizzes, submissions);
  } catch (error) {
    console.log("Error fetching quizzes", error);
  }
});
let userRole;

// Creates and appends quiz cards to the quiz container
function displayQuizzes(quizzes, submissions) {
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

  const container = document.getElementById("quizContainer");
  const now = new Date();
  let upcomingQuizzes;

  if (userRole === "student") {
    const submittedQuizIds = submissions
      .filter((sub) => sub.student === userId)
      .map((sub) => sub.quizID);
    upcomingQuizzes = quizzes.filter(
      (quiz) =>
        new Date(quiz.deadline) > now &&
        !submittedQuizIds.includes(quiz.quizid),
    );
  } else {
    upcomingQuizzes = quizzes;
  }

  upcomingQuizzes.forEach((quiz) => {
    const card = document.createElement("div");
    card.className = "card";
    card.addEventListener("click", () => {
      window.location.href = `/html/takeQuiz.html?quizID=${quiz.quizid}`;
    });

    // create and append title
    const title = document.createElement("h2");
    title.textContent = quiz.quiztitle;
    card.append(title);

    // create and append professor name
    const professor = document.createElement("p");
    professor.innerHTML = `<strong>Professor:</strong> ${quiz.professorname}`;
    card.appendChild(professor);

    // create and append course name
    const course = document.createElement("p");
    course.innerHTML = `<strong>Course:</strong> ${quiz.coursetitle} (${quiz.coursecrn})`;
    card.appendChild(course);

    // create and append deadline
    const deadline = document.createElement("p");
    deadline.innerHTML = `<strong>Deadline:</strong> ${new Date(quiz.deadline).toLocaleString()}`;
    card.appendChild(deadline);

    // Only show Edit and Submissions buttons if the user is not a student
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));
    if (userCookie.includes("professor")) {
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
        window.location.href = `submissions.html?quizID=${quiz.quizid}`;
      });
      card.append(viewSubmissionsButton);
    }

    // append complete card to container
    container.appendChild(card);
  });

  if (upcomingQuizzes.length === 0) {
    const emptyText = document.createElement("p");
    if (userRole === "student") {
      emptyText.innerText = "You have no upcoming quizzes at the moment!";
    } else if (userRole === "professor") {
      emptyText.innerText = "You have not created any quizzes for this course!";
    }

    container.appendChild(emptyText);
  }
}
