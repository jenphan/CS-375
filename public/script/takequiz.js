document.addEventListener("DOMContentLoaded", async () => {
  const url = new URLSearchParams(window.location.search);
  const quizID = url.get("quizID");

  if (!quizID) {
    console.log("Quiz ID is missing");
    return;
  }

  try {
    const response = await fetch(`/quiz/take/${quizID}`);
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
  const quizFormContainer = document.getElementById("quizForm");
  const quizForm = document.createElement("div");
  quizForm.id = "quizFormElement";

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
  const quizSubmitButton = document.createElement("button");
  quizSubmitButton.innerText = "Submit Quiz";
  quizSubmitButton.setAttribute("id", "submitQuizButton");
  quizForm.appendChild(quizSubmitButton);

  quizFormContainer.appendChild(quizForm);

  document
  .getElementById("submitQuizButton")
  .addEventListener("click", async () => {
    const url = new URLSearchParams(window.location.search);
    const quizID = url.get("quizID");

    const inputs = quizForm.querySelectorAll("input, textarea, select");
    let submission = {};

    inputs.forEach(input => {
      const name = input.name;
      const type = input.type;
      let value;
      if (type === "checkbox") {
        if (input.checked) {
          value = input.value;
        }
      } else if (type == "radio" && input.checked) {
        value = input.value;
      } else {
        value = input.value;
      }

      if (name in submission) {
        if (Array.isArray(submission[name])) {
          submission[name].push(value);
        } else {
          submission[name] = [submission[name], value];
        }
      } else {
        submission[name] = value;
      }
    });

    // hardcoded studentid
    const submissionData = {
      studentid: 2,
      submission: JSON.stringify(submission),
      quizVersion: quizID,
      submissionDate: new Date(),
    }

    try {
      const response = await fetch("/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });
  
      if (response.ok) {
        console.log("Quiz successfully submitted!");
        await fetch("/quiz/savesubmission", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        });
      } else {
        console.log("Error submitting quiz", response.statusText);
      }
    } catch (error) {
      console.log("Error submitting quiz", error);
    }
  });
}