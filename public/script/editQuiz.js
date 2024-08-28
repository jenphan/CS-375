document.addEventListener("DOMContentLoaded", async () => {
  const url = new URLSearchParams(window.location.search);
  const quizID = url.get("quizID");

  if (!quizID) {
    console.log("Quiz ID is missing");
    return;
  }

  try {
    const response = await fetch(`/quiz/edit/${quizID}`);
    if (response.ok) {
      const quiz = await response.json();
      loadQuizData(quiz);
    } else {
      console.log("Error while fetching quiz data", response.statusText);
    }
  } catch (error) {
    console.log("Error while fetching quiz data", error);
  }
});

document
  .getElementById("addQuestionButton")
  .addEventListener("click", addQuestion);

document
  .getElementById("updateQuizButton")
  .addEventListener("click", async () => {
    const url = new URLSearchParams(window.location.search);
    const quizID = url.get("quizID");

    if (!quizID) {
      console.log("Quiz ID is missing");
      return;
    }

    const quizData = createQuizData();
    if (!quizData) return;

    try {
      const response = await fetch(`/quiz/edit/${quizID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });

      if (response.ok) {
        document.getElementById("quizLink").style.display = "block";
      }
    } catch (error) {
      console.log("Error updating quiz");
    }
  });

function loadQuizData(quizData) {
  document.getElementById("title").value = quizData.title;
  const deadline = new Date(quizData.deadline).toISOString().slice(0, 16);
  document.getElementById("deadline").value = deadline;

  const { hours, minutes, seconds } = convertSecondsToTime(quizData.timer);
  document.getElementById("timer-hours").value = hours;
  document.getElementById("timer-minutes").value = minutes;
  document.getElementById("timer-seconds").value = seconds;
  const questions = quizData.quiz;

  questionCount = 0;

  questions.forEach((questionData) => {
    addQuestion();
    const questionElement = document.querySelector(
      `.question[data-index='${questionCount}']`,
    );
    populateQuestion(questionElement, questionData);
  });
}

function populateQuestion(questionElement, questionData) {
  const { type, content, points, autograding } = questionData;
  questionElement.querySelector(".question-type").value = type;
  questionElement.querySelector(".question-content").value = content;
  questionElement.querySelector(".question-points").value = points;
  questionElement.querySelector(".autograding").checked = autograding;

  handleQuestionTypeChange(questionElement.querySelector(".question-type"));

  if (questionData.type === "short-answer") {
    questionElement.querySelector(".max-characters").value =
      questionData.maxCharacters || "";
    questionElement.querySelector(".correct-answer").value =
      questionData.correctAnswer || "";
  } else if (questionData.type === "long-answer") {
    questionElement.querySelector(".min-characters").value =
      questionData.minCharacters || "";
    questionElement.querySelector(".max-characters").value =
      questionData.maxCharacters || "";
  } else if (questionData.type === "true-false") {
    questionElement.querySelector(
      `.true-false-options input[value='${questionData.correctAnswer}']`,
    ).checked = true;
  } else if (
    ["multiple-choice", "checkboxes", "dropdown"].includes(questionData.type)
  ) {
    const numOfOptions = questionElement.querySelector(".num-of-options");
    numOfOptions.value = questionData.options.length;

    updateCorrectOptions(numOfOptions);

    questionData.options.forEach((option, index) => {
      questionElement.querySelectorAll(".option")[index].value = option;
      if (questionData.type === "multiple-choice") {
        questionElement.querySelectorAll(".option")[index].value = option;
      } else if (questionData.type === "checkboxes") {
        questionData.correctAnswer.forEach((correctAnswerIndex) => {
          questionElement.querySelector(
            `.answer-checkbox[value='${correctAnswerIndex}']`,
          ).checked = true;
        });
      } else if (questionData.type === "dropdown") {
        questionElement.querySelector(".answer-dropdown select").value =
          questionData.correctAnswer;
      }
    });
  }
  toggleAutograding(questionElement.querySelector(".autograding"));
}

function handleQuestionTypeChange(selected) {
  const questionElement = selected.closest(".question");
  const optionsContainer = questionElement.querySelector(".options-input");
  const trueFalseOptions = questionElement.querySelector(".true-false-options");
  const answerCheckboxes = questionElement.querySelector(".answer-checkboxes");
  const answerRadios = questionElement.querySelector(".answer-radios");
  const answerDropdown = questionElement.querySelector(".answer-dropdown");
  const correctAnswerLabel = questionElement.querySelector(
    ".correct-answer-label",
  );
  const correctAnswerInput = questionElement.querySelector(".correct-answer");
  const autogradingLabel = questionElement.querySelector(".autograding-label");
  const autogradingInput = questionElement.querySelector(".autograding");

  const validationSettings = questionElement.querySelector(
    ".validation-settings",
  );
  if (validationSettings) {
    validationSettings.style.display = ["short-answer", "long-answer"].includes(
      selected.value,
    )
      ? ""
      : "none";

    const shortAnswerValidation = questionElement.querySelector(
      ".short-answer-validation",
    );
    const longAnswerValidation = questionElement.querySelector(
      ".long-answer-validation",
    );

    shortAnswerValidation.style.display =
      selected.value == "short-answer" ? "" : "none";
    longAnswerValidation.style.display =
      selected.value == "long-answer" ? "" : "none";
  }

  const isMultipleOptions = [
    "multiple-choice",
    "checkboxes",
    "dropdown",
  ].includes(selected.value);

  optionsContainer.style.display = isMultipleOptions ? "" : "none";
  trueFalseOptions.style.display = selected.value == "true-false" ? "" : "none";
  answerCheckboxes.style.display = selected.value == "checkboxes" ? "" : "none";
  answerRadios.style.display =
    selected.value == "multiple-choice" ? "" : "none";
  answerDropdown.style.display = selected.value == "dropdown" ? "" : "none";

  correctAnswerLabel.style.display = ["file-upload", "long-answer"].includes(
    selected.value,
  )
    ? "none"
    : "";
  correctAnswerInput.style.display =
    selected.value === "short-answer" ? "" : "none";
  autogradingLabel.style.display = ["file-upload", "long-answer"].includes(
    selected.value,
  )
    ? "none"
    : "";
  autogradingInput.style.display = ["file-upload", "long-answer"].includes(
    selected.value,
  )
    ? "none"
    : "";
}

function toggleAutograding(checkbox) {
  const answerContainer = checkbox
    .closest(".question")
    .querySelector(".answer-input");
  answerContainer.style.display = checkbox.checked ? "" : "none";
}

async function createQuiz() {
  const quizData = createQuizData();
  console.log(JSON.stringify(quizData));

  try {
    const response = await fetch("/quiz/createquiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizData),
    });

    if (response.ok) {
      console.log("Quiz successfully created!");
      await fetch("/quiz/savequiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });
      document.getElementById("quizLink").style.display = "block";
    } else {
      console.log("Error creating quiz", response.statusText);
    }
  } catch (error) {
    console.log("Error creating quiz", error);
  }
}

function updateCorrectOptions(input) {
  const numberOfOptions = input.value;
  const optionsContainer = input
    .closest(".options-input")
    .querySelector(".options-container");
  const answerCheckboxes = input
    .closest(".question")
    .querySelector(".answer-checkboxes");
  const answerRadios = input
    .closest(".question")
    .querySelector(".answer-radios");
  const answerDropdown = input
    .closest(".question")
    .querySelector(".answer-dropdown select");

  optionsContainer.innerHTML = "";
  answerCheckboxes.innerHTML = "";
  answerRadios.innerHTML = "";
  answerDropdown.innerHTML = "";

  for (let i = 0; i < numberOfOptions; i++) {
    const option = document.createElement("div");
    option.innerHTML = `
            <label>Option ${i + 1}:</label>
            <input type="text" class="option">
        `;
    optionsContainer.appendChild(option);

    const answerCheckbox = document.createElement("div");
    answerCheckbox.innerHTML = `
            <label>Option ${i + 1}:</label>
            <input type="checkbox" class="answer-checkbox" value=${i}>
        `;
    answerCheckboxes.appendChild(answerCheckbox);

    const answerRadio = document.createElement("div");
    answerRadio.innerHTML = `
            <label>Option ${i + 1}:</label>
            <input type="radio" name="correct-answer-${questionCount}" class="answer-radio" value=${i}>
        `;
    answerRadios.appendChild(answerRadio);

    const answerDropdownOption = document.createElement("option");
    answerDropdownOption.value = i + 1;
    answerDropdownOption.text = `Option ${i + 1}`;
    answerDropdown.appendChild(answerDropdownOption);
  }
}

function convertSecondsToTime(totalSeconds) {
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}
