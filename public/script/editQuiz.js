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
  document.getElementById("deadline").value = quizData.deadline;

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

function convertSecondsToTime(totalSeconds) {
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
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
      `.true-false-topions input[value='${questionData.correctAnswer}']`,
    ).checked = true;
  } else if (
    ["multiple-choice", "checkboxes", "dropdown"].includes(questionData.type)
  ) {
    const numOfOptions = questionElement.querySelector(".num-of-options");
    numOfOptions.value = questionData.options.length;

    updateOptions(numOfOptions);

    questionData.options.forEach((option, index) => {
      questionElement.querySelectorAll(".option")[index].value = option;
    });

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

function updateOptions(input) {
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

function createQuizData() {
  const quizTitle = document.getElementById("title").value.trim();
  const quizDeadline = document.getElementById("deadline").value.trim();
  const timerHours = document.getElementById("timer-hours").value.trim();
  const timerMinutes = document.getElementById("timer-minutes").value.trim();
  const timerSeconds = document.getElementById("timer-seconds").value.trim();
  const questions = document.querySelectorAll(".question");

  if (!quizTitle) {
    alert("Quiz title is required");
    return;
  }

  if (!quizDeadline) {
    alert("Quiz deadline is required");
    return;
  }

  if (questions.length === 0) {
    alert("You must add at least one question to the quiz.");
    return;
  }

  const quiz = [];

  for (const question of questions) {
    if (!validateQuestion(question) && !alertShown) {
      return alert("Please fill out all required fields correctly.");
    }
  }

  questions.forEach((question) => {
    const questionType = question.querySelector(".question-type").value;
    const questionContent = question.querySelector(".question-content").value;
    const questionPoints = question.querySelector(".question-points").value;
    const autograding = question.querySelector(".autograding").checked;

    const questionData = {
      type: questionType,
      content: questionContent,
      points: questionPoints,
      autograding: autograding,
    };

    if (questionType === "short-answer") {
      questionData.maxCharacters =
        question.querySelector(".max-characters").value || null;
    } else if (questionType === "long-answer") {
      questionData.minCharacters =
        question.querySelector(".min-characters").value || null;
      questionData.maxCharacters =
        question.querySelector(".max-characters").value || null;
    }

    if (questionType === "short-answer") {
      questionData.correctAnswer =
        question.querySelector(".correct-answer").value || null;
    } else if (questionType === "true-false") {
      questionData.correctAnswer =
        question.querySelector(".true-false-options input:checked")?.value ||
        null;
    } else if (
      ["multiple-choice", "checkboxes", "dropdown"].includes(questionType)
    ) {
      const options = [];
      question.querySelectorAll(".option").forEach((option) => {
        options.push(option.value);
      });

      questionData.options = options;

      if (questionType === "multiple-choice") {
        questionData.correctAnswer =
          question.querySelector(".answer-radio:checked")?.value || null;
      } else if (questionType === "checkboxes") {
        const correctAnswers = [];
        question
          .querySelectorAll(".answer-checkbox:checked")
          .forEach((checkbox) => {
            correctAnswers.push(checkbox.value);
          });
        questionData.correctAnswer = correctAnswers;
      } else if (questionType === "dropdown") {
        questionData.correctAnswer = question.querySelector(
          ".answer-dropdown select",
        ).value;
      }
    } else if (
      questionType === "long-answer" ||
      questionType === "file-upload"
    ) {
      questionData.correctAnswer = null;
    }
    quiz.push(questionData);
  });

  let totalSeconds = 0;
  if (timerHours) totalSeconds += parseInt(timerHours, 10) * 3600;
  if (timerMinutes) totalSeconds += parseInt(timerMinutes, 10) * 60;
  if (timerSeconds) totalSeconds += parseInt(timerSeconds, 10);

  return {
    title: quizTitle,
    professorId: 1,
    deadline: quizDeadline || null,
    timer: totalSeconds || null,
    questions: JSON.stringify(quiz),
  };
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

function addQuestion() {
  questionCount++;

  const questionContainer = document.getElementById("questionsContainer");
  const questionElement = document.createElement("div");
  questionElement.className = "question";
  questionElement.draggable = true;
  questionElement.dataset.index = questionCount;

  questionElement.innerHTML = `
    <div class="questionSection">
        <label>Question ${questionCount}<span style="color: red;">*</span></label>
        <select class="question-type" onchange="handleQuestionTypeChange(this)" required>
            <option value="" disabled selected>Select question type</option>
            <option value="short-answer">Short Answer</option>
            <option value="long-answer">Long Answer</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
            <option value="checkboxes">Checkboxes</option>
            <option value="dropdown">Dropdown</option>
            <option value="file-upload">File Upload</option>
        </select>
        <div>
            <label>Question<span style="color: red;">*</span></label>
            <input type="text" class="question-content" required>
            <br>
            <label>Points<span style="color: red;">*</span></label>
            <input type="number" class="question-points" required>
            <br>
            <label class="autograding-label">Automatic Grading?</label>
            <input type="checkbox" class="autograding" onchange="toggleAutograding(this)">
        </div>
        <div class="validation-settings" style="display: none">
            <div class="short-answer-validation" style="display: none">
                <label>Max Characters:</label>
                <input type="number" class="max-characters">
            </div>
            <div class="long-answer-validation" style="display: none">
                <label>Min Characters:</label>
                <input type="number" class="min-characters">
                <label>Max Characters:</label>
                <input type="number" class="max-characters">
            </div>
        </div>
        <div class="options-input" style="display: none">
            <label>Number of Options<span style="color: red;">*</span></label>
            <input type="number" class="num-of-options" min="1" onchange="updateOptions(this)">
            <div class="options-container"></div>
        </div>
        <div class="answer-input" style="display: none">
            <label class="correct-answer-label">Correct Answer<span style="color: red;">*</span></label>
            <input type="text" class="correct-answer">
            <div class="true-false-options" style="display: none">
                <label><input type="radio" name="true-false-${questionCount}" value="true"> True</label>
                <label><input type="radio" name="true-false-${questionCount}" value="false"> False</label>
            </div>
            <div class="answer-checkboxes" style="display: none"></div>
            <div class="answer-radios" style="display: none"></div>
            <div class="answer-dropdown" style="display: none"><select></select></div>
        </div>
        <button id="deleteQuestionButton" onclick="deleteQuestion(this)">Delete</button>
    </div>
    `;

  questionContainer.appendChild(questionElement);
}
