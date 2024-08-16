document.addEventListener("DOMContentLoaded", () => {
  const questionContainer = document.getElementById("questionsContainer");
  questionContainer.addEventListener("dragstart", handleDragStart);
  questionContainer.addEventListener("dragover", handleDragOver);
  questionContainer.addEventListener("drop", handleDrop);
  questionContainer.addEventListener("dragend", handleDragEnd);
});

const validation = {
  "short-answer": validateShortAnswer,
  "multiple-choice": validateMultipleChoice,
  "true-false": validateTrueFalse,
  checkboxes: validateCheckboxes,
  dropdown: validateDropdown,
};

let draggedElement = null;

function handleDragStart(event) {
  draggedElement = event.target.closest(".question");
  event.dataTransfer.setData("text/plain", draggedElement.dataset.index);
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  const dropTarget = event.target.closest(".question");
  if (draggedElement && dropTarget && draggedElement !== dropTarget) {
    const parentElement = draggedElement.parentNode;
    parentElement.insertBefore(draggedElement, dropTarget.nextSibling);
    draggedElement = null;
    renumberQuestions();
  }
}

function handleDragEnd(event) {
  draggedElement = null;
}

let questionCount = 0;

document
  .getElementById("addQuestionButton")
  .addEventListener("click", addQuestion);
document
  .getElementById("createQuizButton")
  .addEventListener("click", createQuiz);

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

function deleteQuestion(button) {
  const questionElement = button.closest(".question");
  questionElement.remove();
  renumberQuestions();
}

function renumberQuestions() {
  const questions = document.querySelectorAll(".question");
  questionCount = 0;

  questions.forEach((question, index) => {
    questionCount++;
    question.dataset.index = questionCount;
    const label = question.querySelector("label");
    if (label) {
      label.textContent = `Question ${questionCount}`;
    }

    const radios = question.querySelectorAll(".answer-radio");
    radios.forEach((radio) => {
      radio.name = `correct-answer-${questionCount}`;
    });

    const trueFalse = question.querySelectorAll(".true-false-options input");
    trueFalse.forEach((input) => {
      input.name = `true-false-${questionCount}`;
    });
  });
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

async function createQuiz() {
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

  const quizData = {
    title: quizTitle,
    professorId: 1,
    deadline: quizDeadline || null,
    timer: totalSeconds || null,
    questions: JSON.stringify(quiz),
  };

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

function validateQuestion(question) {
  const type = question.querySelector(".question-type").value;
  return validation[type] ? validation[type](question) : true;
}

function validateShortAnswer(question) {
  let valid = true;
  const correctAnswer = question.querySelector(".correct-answer").value.trim();
  const autograding = question.querySelector(".autograding").checked;
  if (autograding) {
    if (!correctAnswer) valid = false;
    if (correctAnswer.length < 1) valid = false;
  }
  return valid;
}

function validateMultipleChoice(question) {
  let valid = true;
  const numberOfOptions = question.querySelector(".num-of-options").value;
  const options = question.querySelectorAll(".option");
  const correctAnswer = question.querySelector(".answer-radio:checked");
  const autograding = question.querySelector(".autograding").checked;

  options.forEach((option) => {
    if (option.value.trim().length === 0) {
      valid = false;
    }
  });

  if (autograding) {
    if (!correctAnswer) valid = false;
  }

  return numberOfOptions > 0 && valid;
}

function validateTrueFalse(question) {
  let valid = true;
  const correctAnswer = question.querySelector(
    ".true-false-options input:checked",
  );
  const autograding = question.querySelector(".autograding").checked;
  if (autograding) {
    if (!correctAnswer) valid = false;
  }

  return valid;
}

function validateCheckboxes(question) {
  let valid = true;
  const numberOfOptions = question.querySelector(".num-of-options").value;
  const options = question.querySelectorAll(".option");
  const correctAnswer = question.querySelector(".answer-checkbox:checked");
  const autograding = question.querySelector(".autograding").checked;

  options.forEach((option) => {
    if (option.value.trim().length === 0) {
      valid = false;
    }
  });

  if (autograding) {
    if (!correctAnswer) valid = false;
  }

  return numberOfOptions > 0 && valid;
}

function validateDropdown(question) {
  let valid = true;
  const numberOfOptions = question.querySelector(".num-of-options").value;
  const options = question.querySelectorAll(".option");
  const correctAnswer = question.querySelector(".answer-dropdown select").value;
  const autograding = question.querySelector(".autograding").checked;

  options.forEach((option) => {
    if (option.value.trim().length === 0) {
      valid = false;
    }
  });

  if (autograding) {
    if (!correctAnswer) valid = false;
  }

  return numberOfOptions > 0 && valid;
}

async function editQuiz(quizID) {
  try {
    const response = await fetch(`/quiz/take/${quizID}`);
    if (response.ok) {
      const quizData = await response.json();
      populateQuizForm(quizData);
    } else {
      console.log("Error fetching quiz data for editing.");
    }
  } catch (error) {
    console.log("Error fetching quiz data for editing.");
  }
}

function populateQuizForm(quizData) {
  document.getElementById("title").value = quizData.quizTitle || "";
  document.getElementById("deadline").value = quizData.deadline || "";

  if (quizData.timer) {
    const totalSeconds = quizData.timer;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById("timer-hours").value = hours;
    document.getElementById("timer-minutes").value = minutes;
    document.getElementById("timer-seconds").value = seconds;
  } else {
    document.getElementById("timer-hours").value = "";
    document.getElementById("timer-minutes").value = "";
    document.getElementById("timer-seconds").value = "";
  }

  const questionContainer = document.getElementById("questionsContainer");
  questionContainer.innerHTML = "";

  const questions = JSON.parse(quizData.quiz);
  questions.forEach((questionData, index) => {
    addQuestion();
    const questionElement = document.querySelectorAll(".question")[index];
    questionElement = document.querySelector(".question-type").value =
      questionData.type;
    handleQuestionTypeChange(questionElement.querySelector(".question-type"));

    questionElement.querySelector(".question-content").value =
      questionData.content || "";
    questionElement.querySelector(".question-points").value =
      questionData.points || "";

    const autogradingInput = questionElement.querySelector(".autograding");
    autogradingInput.checked = questionData.autograding || false;
    toggleAutograding(autogradingInput);
  });

  if (questionData.type === "short-answer") {
    questionElement.querySelector(".max-characters").value =
      questionData.maxCharacters || "";
  } else if (questionData.type === "long-answer") {
    questionElement.querySelector("min-characters").value =
      questionData.minCharacters || "";
    questionElement.querySelector("max-characters").value =
      questionData.maxCharacters || "";
  }

  if (
    ["multiple-choice", "checkboxes", "dropdown"].includes(questionData.type)
  ) {
    updateOptions(questionElement.querySelector(".num-of-options"));
    const options = questionElement.querySelectorAll(".option");
    options.forEach((option, index) => {
      option.value = questionData.options[index] || "";
    });

    if (questionData.type === "multiple-choice") {
      const correctAnswer = questionElement.querySelector(
        ".answer-radio[value='" + questionData.correctAnswer + "']",
      );
      if (correctAnswer) correctAnswer.checked = true;
    } else if (questionData.type === "checkboxes") {
      questionData.correctAnswer.forEach((answer) => {
        const checkbox = questionElement.querySelector(
          ".answer-checkbox[value='" + answer + "']",
        );
        if (checkbox) checkbox.checked = true;
      });
    } else if (questionData.type === "dropdown") {
      const dropdown = questionElement.querySelector(".answer-dropdown select");
      dropdown.value = questionData.correctAnswer || "";
    } else if (questionData.type === "true-false") {
      const correctAnswer = questionElement.querySelector(
        ".true-false-options input[value='" +
          questionData.correctAnswer +
          "']'",
      );
      if (correctAnswer) correctAnswer.checked = true;
    }
  }
  renumberQuestions();
}

async function updateQuiz(quizID) {
  const quizTitle = document.getElementById("title").value.trim();
  const quizDeadline = document.getElementById("deadline").value.trim();
  const timerHours = document.getElementById("timer-hours").value.trim();
  const timerMinutes = document.getElementById("timer-minutes").value.trim();
  const timerSeconds = document.getElementById("timer-seconds").value.trim();
  const questions = document.querySelectorAll(".question");

  const quiz = [];

  for (const question of questions) {
    if (!validateQuestion(question)) {
      return alert("Please fill out all required fields correctly.");
    }

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
        question.querySelector(".max-characters").value || "";
    } else if (questionType === "long-answer") {
      questionData.minCharacters =
        question.querySelector(".min-characters").value || "";
      questionData.maxCharacters =
        question.querySelector(".max-characters").value || "";
    }

    if (questionType === "short-answer") {
      questionData.correctAnswer =
        question.querySelector(".correct-answer").value || "";
    } else if (questionType === "true-false") {
      questionData.correctAnswer =
        question.querySelector(".true-false-options input:checked")?.value ||
        "";
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
          question.querySelector(".answer-radio:checked")?.value || "";
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
      questionData.correctAnswer = "";
    }
    quiz.push(questionData);
  }

  let totalSeconds = 0;
  if (timerHours) totalSeconds += parseInt(timerHours, 10) * 3600;
  if (timerMinutes) totalSeconds += parseInt(timerMinutes, 10) * 60;
  if (timerSeconds) totalSeconds += parseInt(timerSeconds, 10);

  const quizData = {
    title: quizTitle,
    professorId: 1,
    deadline: quizDeadline || "",
    timer: totalSeconds || "",
    questions: JSON.stringify(quiz),
  };

  console.log(JSON.stringify(quizData));

  try {
    const response = await fetch(`/quiz/update/${quizID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizData),
    });

    if (response.ok) {
      console.log("Quiz successfully updated!");
      document.getElementById("quizLink").style.display = "block";
    } else {
      console.log("Error updating quiz", response.statusText);
    }
  } catch (error) {
    console.log("Error updating quiz", error);
  }
}
