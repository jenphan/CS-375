document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/quiz/get-quizzes");
    const quizzes = await response.json();

    const container = document.getElementById("quizContainer");

    quizzes.forEach((quiz) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
                <h2>${quiz.quiztitle}</h2>
                <p>Professor: ${quiz.professorname}</p>
                <p>Deadline: ${new Date(quiz.deadline).toLocaleString()}</p>
            `;
      card.addEventListener("click", () => {
        window.location.href = `/html/takequiz.html?quizID=${quiz.quizid}`;
      });
      container.appendChild(card);
    });
  } catch (error) {
    console.log("Error fetching quizzes", error);
  }
});
