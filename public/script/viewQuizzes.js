document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/quiz/get-quizzes");
    const quizzes = await response.json();
    displayQuizzes(quizzes);
  } catch (error) {
    console.log("Error fetching quizzes", error);
  }
});

// Creates and appends quiz cards to the quiz container
function displayQuizzes(quizzes) {
  const container = document.getElementById("quizContainer");

  quizzes.forEach((quiz) => {
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
    professor.textContent = `Professor: ${quiz.professorname}`;
    card.appendChild(professor);

    // create and append deadline
    const deadline = document.createElement("p");
    deadline.textContent = `Deadline: ${new Date(quiz.deadline).toLocaleString()}`;
    card.appendChild(deadline);

    // create and append edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", (event) => {
      event.stopPropagation();
      window.location.href = `editQuiz.html?quizID=${quiz.quizid}`;
    });
    card.appendChild(editButton);

    // create and append view submissions button
    const viewSubmissionsButton = document.createElement("button");
    viewSubmissionsButton.textContent = "Submissions";
    viewSubmissionsButton.addEventListener("click", (event) => {
      event.stopPropagation();
      window.location.href = `submissions.html?quizID=${quiz.quizid}`;
    });
    card.append(viewSubmissionsButton);

    // append complete card to container
    container.appendChild(card);
  });
}
