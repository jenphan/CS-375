document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/quiz/get-quizzes");
    const quizzes = await response.json();

    const container = document.getElementById("quizContainer");

    quizzes.forEach((quiz) => {
      const card = document.createElement("div");
      card.className = "card";
      card.addEventListener("click", () => {
        window.location.href = `/html/takeQuiz.html?quizID=${quiz.quizid}`;
      });

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", (event) => {
        event.stopPropagation();
        window.location.href = `editQuiz.html?quizID=${quiz.quizid}`;
      });

      const viewSubmissionsButton = document.createElement("button");
      viewSubmissionsButton.textContent = "Submissions";
      viewSubmissionsButton.addEventListener("click", (event) => {
        event.stopPropagation();
        window.location.href = `submissions.html?quizID=${quiz.quizid}`;
      });

      card.innerHTML = `
        <h2>${quiz.quiztitle}</h2>
        <p>Professor: ${quiz.professorname}</p>
        <p>Deadline: ${new Date(quiz.deadline).toLocaleString()}</p>
      `;

      card.appendChild(editButton);
      card.append(viewSubmissionsButton);
      container.appendChild(card);
    });
  } catch (error) {
    console.log("Error fetching quizzes", error);
  }
});
