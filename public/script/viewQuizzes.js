document.addEventListener("DOMContentLoaded", async () => {
  const userRole = localStorage.getItem("userRole");
  if (userRole === "student") {
    document.getElementById("create-new-quiz").style.display = "none";
  }
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
                <button onclick="editQuiz(${quiz.quizid})">Edit</button>
            `;
      card.addEventListener("click", () => {
        window.location.href = `/html/takeQuiz.html?quizID=${quiz.quizid}`;
      });
      container.appendChild(card);
    });
  } catch (error) {
    console.log("Error fetching quizzes", error);
  }
});

async function editQuiz() {
  try {
    const response = await fetch(`/quiz/edit/${quizID}`);
    if (response.ok) {
      const quiz = await response.json();
      generateQuizForm(quiz, quiz.quiz);
    } else {
      console.log("Error while fetching quiz data", response.statusText);
    }
  } catch (error) {
    console.log("Error while fetching quiz data", error);
  }
}
