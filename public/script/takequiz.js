document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const quizID = urlParams.get("quizID");

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

// Creates and appends quiz form to the container
function generateQuizForm(quiz, quizQuestions) {
  const quizFormContainer = document.getElementById("quizForm");
  const quizForm = document.createElement("div");
  quizForm.id = "quizFormElement";

  // creates and appends quiz title
  const quizTitle = document.createElement("h1");
  quizTitle.textContent = quiz.quiztitle;
  quizForm.appendChild(quizTitle);

  // creaets and appends questions
  quizQuestions.forEach((question, index) => {
    const questionElement = createQuestionElement(question, index);
    quizForm.appendChild(questionElement);
  });

  // creates and appends submit button
  const quizSubmitButton = document.createElement("button");
  quizSubmitButton.innerText = "Submit Quiz";
  quizSubmitButton.setAttribute("id", "submitQuizButton");
  quizForm.appendChild(quizSubmitButton);

  quizFormContainer.appendChild(quizForm);

  // attach submit handler to quiz
  attachSubmitHandler(quiz);
}

// Creates a question element based on the question type
function createQuestionElement(question, index) {
  const questionElement = document.createElement("div");
  questionElement.className = "question";
  questionElement.innerHTML = `<label style="font-weight: bold">${index + 1}. ${question.content}</label>`;

  switch (question.type) {
    case "short-answer":
      questionElement.innerHTML += `<input type="text" name="question-${index}" maxlength="${question.maxCharacters || ""}">`;
      break;
    case "long-answer":
      questionElement.innerHTML += `<textarea name="question-${index}" rows="4" cols="60" minlength="${question.minCharacters || ""}" maxlength="${question.maxCharacters || ""}"></textarea>`;
      break;
    case "true-false":
      questionElement.innerHTML += `
              <label><input type="radio" name="question-${index}" value="true">True</label>
              <label><input type="radio" name="question-${index}" value="false">False</label>
          `;
      break;
    case "multiple-choice":
      question.options.forEach((option, i) => {
        questionElement.innerHTML += `<label><input type="radio" name="question-${index}" value="${i}">${option}</label>`;
      });
      break;
    case "checkboxes":
      question.options.forEach((option, i) => {
        questionElement.innerHTML += `<label><input type="checkbox" name="question-${index}" value="${i}"> ${option}</label>`;
      });
      break;
    case "dropdown":
      questionElement.innerHTML += `
              <select name="question-${index}">
                  ${question.options.map((option, i) => `<option value="${i}">${option}</option>`).join("")}
              </select>
          `;
      break;
    case "file-upload":
      questionElement.innerHTML += `<input type="file" name="question-${index}">`;
      break;
    default:
      console.log("Unknown question type:", question.type);
  }

  return questionElement;
}

// attaches a submit handler to the submit button
function attachSubmitHandler(quiz) {
  const submitButton = document.getElementById("submitQuizButton");
  submitButton.addEventListener("click", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quizID = urlParams.get("quizID");
    const quizForm = document.getElementById("quizFormElement")
    const submission = collectFormData(quizForm);

    // hardcoded studentid
    const submissionData = {
      studentid: 2,
      submission: JSON.stringify(submission),
      quizVersion: quizID,
      submissionDate: new Date(),
    };

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

// collects form data into an object
function collectFormData(form) {
  const inputs = quizForm.querySelectorAll("input, textarea, select");
  let submission = {};

  inputs.forEach((input) => {
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
}