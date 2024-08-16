document.addEventListener("DOMContentLoaded", () => {
  const questionContainer = document.getElementById("questionsContainer");

  const eventMappings = {
    dragstart: handleDragStart,
    dragover: handleDragOver,
    drop: handleDrop,
    dragend: handleDragEnd,
    click: handleButtonClicks
  };

  Object.keys(eventMappings).forEach(event => {
    questionContainer.addEventListener(event, eventMappings[event])
  })

  const buttons = {
    addQuestionButton: addQuestion,
    createQuizButton: createQuiz
  }

  Object.keys(buttons).forEach(id => {
    document.getElementById(id).addEventListener("click", buttons[id]);
  })
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

function handleDragEnd() {
  draggedElement = null;
}

function handleButtonClicks(event) {
  if (event.target.matches("#deleteQuestionButton")) {
    deleteQuestion(event.target);
  }
}

let questionCount = 0;

function addQuestion() {
  questionCount++;
  const questionContainer = document.getElementById("questionsContainer");
  const questionElement = createQuestionElement(questionCount);
  questionContainer.appendChild(questionElement);
}

function createQuestionElement(index) {
  const questionElement = document.createElement("div");
  questionElement.className = "question";
  questionElement.draggable = true;
  questionElement.dataset.index = index;

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
    return questionElement;
}

function deleteQuestion(button) {
  button.closest(".question").remove();
  renumberQuestions();
}

function renumberQuestions() {
  const questions = document.querySelectorAll(".question");

  questions.forEach((question, index) => {
    questionCount++;
    question.dataset.index = questionCount;
    const label = question.querySelector("label");
    if (label) label.textContent = `Question ${questionCount}`;

    updateNames(question, questionCount)
  });
}

function updateNames(question, count) {
  question.querySelectorAll(".answer-radio").forEach((radio) => {
    radio.name = `correct-answer-${count}`;
  });

  question.querySelectorAll(".true-false-options input").forEach((input) => {
    input.name = `true-false-${count}`;
  });
}

function handleQuestionTypeChange(selected) {
  const questionElement = selected.closest(".question");
  const type = selected.value

  const displayMap = {
    "short-answer": ".short-answer-validation",
    "long-answer": ".long-answer-validation",
    "true-false": ".true-false-options",
    "multiple-choice": ".options-input",
    "checkboxes": ".options-input",
    "dropdown": ".options-input",
    "file-upload": ".answer-input"
  };

  Object.values(displayMap).forEach(selector => {
    const element = questionElement.querySelector(selector);
    if (element) element.style.display = "none"
  });

  if (type in displayMap) {
    const displayElement = questionElement.querySelector(displayMap[type]);
    if (displayElement) displayElement.style.display = "";
  };

  const isMultipleOptions = [
    "multiple-choice",
    "checkboxes",
    "dropdown",
  ].includes(type);
  questionElement.querySelector(".options-input").style.display = isMultipleOptions ? "" : "none";

  const isAutogradingVisible = ["file-upload", "long-answer"].includes(type);
  questionElement.querySelector(".correct-answer-label").style.display = isAutogradingVisible ? "none" : "";
  questionElement.querySelector(".correct-answer").style.display = type === "short-answer" ? "" : "none";
  questionElement.querySelector(".autograding-label").style.display = isAutogradingVisible ? "none" : "";
  questionElement.querySelector(".autograding").style.display = isAutogradingVisible ? "none" : "";

  questionElement.querySelector(".true-false-options").style.display = type == "true-false" ? "" : "none";
  questionElement.querySelector(".answer-checkboxes").style.display = type == "checkboxes" ? "" : "none";
  questionElement.querySelector(".answer-radios").style.display = type == "multiple-choice" ? "" : "none";
  questionElement.querySelector(".answer-dropdown").style.display = type == "dropdown" ? "" : "none";

  const validationSettings = questionElement.querySelector(
    ".validation-settings",
  );
  validationSettings.style.display = ["short-answer", "long-answer"].includes(type) ? "" : "none";
}

function toggleAutograding(checkbox) {
  const answerContainer = checkbox
    .closest(".question")
    .querySelector(".answer-input");
  answerContainer.style.display = checkbox.checked ? "" : "none";
}

function updateOptions(input) {
  const numberOfOptions = input.value;
  const questionElement = input.closest(".question");

  const options = ["options-container", "answer-checkboxes", "answer-radios", "answer-dropdown"]
  options.forEach(optionClass => {
    const container = questionElement.querySelector(`.${optionClass}`);
    container.innerHTML = "";
  })

  for (let i = 0; i < numberOfOptions; i++) {
    const optionDiv = document.createElement("div");
    optionDiv.innerHTML = `
            <label>Option ${i + 1}:</label>
            <input type="text" class="option">
        `;
    questionElement.querySelector(".options-container").appendChild(optionDiv);

    const checkboxDiv = document.createElement("div");
    checkboxDiv.innerHTML = `
            <label>Option ${i + 1}:</label>
            <input type="checkbox" class="answer-checkbox" value=${i}>
        `;
    questionElement.querySelector(".answer-checkboxes").appendChild(checkboxDiv);

    const radioDiv = document.createElement("div");
    radioDiv.innerHTML = `
            <label>Option ${i + 1}:</label>
            <input type="radio" name="correct-answer-${questionCount}" class="answer-radio" value=${i}>
        `;
    questionElement.querySelector(".answer-radios").appendChild(radioDiv);

    const optionElement = document.createElement("option");
    optionElement.value = i + 1;
    optionElement.text = `Option ${i + 1}`;
    questionElement.querySelector(".answer-dropdown select").appendChild(optionElement);
  }
}

async function createQuiz() {
  const quizTitleElement = document.getElementById("title");
  const quizDeadlineElement = document.getElementById("deadline");
  const timerHoursElement = document.getElementById("timer-hours");
  const timerMinutesElement = document.getElementById("timer-minutes");
  const timerSecondsElement = document.getElementById("timer-seconds").value.trim();
  const questions = document.querySelectorAll(".question");

  const quizTitle = quizTitleElement.value.trim();
  const quizDeadline = quizDeadlineElement.value.trim()
  const timerHours = timerHoursElement.value.trim()
  const timerMinutes = timerMinutesElement.value.trim();
  const timerSeconds = timerSecondsElement.value.trim();

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
