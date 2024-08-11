document.addEventListener("DOMContentLoaded", async () => {
  const url = new URLSearchParams(window.location.search);
  const quizID = url.get("quizID");

  if (!quizID) {
    console.log("Quiz ID is missing");
    return;
  }

  try {
    const response = await fetch(`/quiz/${quizID}`);
    if (response.ok) {
      const quiz = await response.json();
      generateQuizForm(quiz, quiz.quiz);
    } else {
      console.log("Error while fetching quiz data", response.statusText);
    }
  } catch (error) {
    console.log("Error while fetching quiz data", error);
  }
});

function generateQuizForm(quiz, quizQuestions) {
  const quizForm = document.getElementById("quizForm");
  const quizTitle = document.createElement("h1");
  quizTitle.textContent = quiz.quiztitle;
  quizForm.appendChild(quizTitle);

  quizQuestions.forEach((question, index) => {
    const questionElement = document.createElement("div");
    questionElement.className = "question";
    questionElement.innerHTML = `<label style="font-weight: bold">${index + 1}. ${question.content}</label>`;

    if (question.type === "short-answer") {
      questionElement.innerHTML += `<input type="text" name="question-${index}" maxlength="${question.maxCharacters || ""}">`;
    } else if (question.type === "long-answer") {
      questionElement.innerHTML += `<textarea name="question-${index}" rows="4" cols="60" minlength="${question.minCharacters || ""}" maxlength="${question.maxCharacters || ""}"></textarea>`;
    } else if (question.type === "true-false") {
      questionElement.innerHTML += `
                <label><input type="radio" name="question-${index}" value="true">True</label>
                <label><input type="radio" name="question-${index}" value="false">False</label>
            `;
    } else if (question.type === "multiple-choice") {
      question.options.forEach((option, i) => {
        questionElement.innerHTML += `<label><input type="radio" name="question-${index}" value="${i}">${option}</label>`;
      });
    } else if (question.type === "checkboxes") {
      question.options.forEach((option, i) => {
        questionElement.innerHTML += `<label><input type="checkbox" name="question-${index}" value="${i}"> ${option}</label>`;
      });
    } else if (question.type === "dropdown") {
      questionElement.innerHTML += `
                <select name="question-${index}">
                    ${question.options.map((option, i) => `<option value="${i}">${option}</option>`).join("")}
                </select>
            `;
    } else if (question.type === "file-upload") {
      questionElement.innerHTML += `<input type="file" name="question-${index}">`;
    }

    quizForm.appendChild(questionElement);
  });
  const quizSubmitBtn = document.createElement("button");
  quizSubmitBtn.innerText = "Submit Quiz";
  quizSubmitBtn.setAttribute("id", "submitQuizBtn");
  quizForm.appendChild(quizSubmitBtn);
}

document.getElementById("submitQuizBtn").addEventListener("click", async () => {
  const quizForm = document.getElementById("quizForm");
  const formData = new FormData(quizForm);
  const quizData = {};
  const quizId = 4141;

  for (let [key, value] of formData.entries()) {
    if (!quizData[key]) {
      quizData[key] = [];
    }
    quizData[key].push(value);
  }

  try {
    const response = await fetch("/quiz/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quizId, response: quizData }),
    });

    if (response.ok) {
      console.log("Quiz was submitted successfully!");
    } else {
      console.log("Error while submitting quiz", response.statusText);
    }
  } catch (error) {
    console.log("Error while submitting quiz", error);
  }
});
