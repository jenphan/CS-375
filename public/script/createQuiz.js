let userId;
let userRole;
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));
    if (userCookie) {
      const decodedCookie = decodeURIComponent(userCookie.split("=")[1]);
      const userData = JSON.parse(decodedCookie);
      userRole = userData.role;
      userId = userData.userid;
    } else {
      console.log("Not logged in – could not extract user id from cookie");
    }
  } catch (error) {
    console.log("Error while extracting user id from cookie", error);
  }

  if (userRole === "professor") {
    try {
      const response = await fetch("/course/current-courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        const courses = await response.json();
        populateCourseDropDown(courses.courses);
      } else {
        console.log("Failed to fetch courses");
      }
    } catch (error) {
      console.log("Error fetching courses", error);
    }
  }

  const questionContainer = document.getElementById("questionsContainer");

  const eventMappings = {
    dragstart: handleDragStart,
    dragover: handleDragOver,
    drop: handleDrop,
    dragend: handleDragEnd,
    click: handleButtonClicks,
  };

  Object.keys(eventMappings).forEach((event) => {
    questionContainer.addEventListener(event, eventMappings[event]);
  });

  const buttons = {
    addQuestionButton: addQuestion,
    createQuizButton: createQuiz,
  };

  Object.keys(buttons).forEach((id) => {
    document.getElementById(id).addEventListener("click", buttons[id]);
  });
});

let questionCount = 0;
let draggedElement = null;

const validation = {
  "short-answer": validateShortAnswer,
  "multiple-choice": validateMultipleChoice,
  "true-false": validateTrueFalse,
  checkboxes: validateCheckboxes,
  dropdown: validateDropdown,
};

// store dragged element's reference and index to set up drag-and-drop
function handleDragStart(event) {
  draggedElement = event.target.closest(".question");
  event.dataTransfer.setData("text/plain", draggedElement.dataset.index);
}

// prevent default browser behavior to allow drag-and-drop
function handleDragOver(event) {
  event.preventDefault();
}

// reorder dragged elements and renumber questions
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

// reset dragged element reference after drag-and-drop ends
function handleDragEnd() {
  draggedElement = null;
}

// handles button click for deleting question
function handleButtonClicks(event) {
  if (event.target.matches("#deleteQuestionButton")) {
    questionCount -= 1;
    deleteQuestion(event.target);
  }
}

// creates and appends question to container
function addQuestion() {
  questionCount++;
  renumberQuestions();
  const questionContainer = document.getElementById("questionsContainer");
  questionContainer.appendChild(createQuestionElement(questionCount));
}

// creates a new question element with provided index and proper content/structure
function createQuestionElement(index) {
  const questionElement = document.createElement("div");
  questionElement.className = "question";
  questionElement.draggable = true;
  questionElement.dataset.index = index;

  questionElement.innerHTML = `
    <div class="questionSection">
        <label>Question ${index}<span style="color: red;">*</span></label>
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
                <input type="number" class="short-max-characters">
            </div>
            <div class="long-answer-validation" style="display: none">
                <label>Min Characters:</label>
                <input type="number" class="min-characters">
                <label>Max Characters:</label>
                <input type="number" class="long-max-characters">
            </div>
        </div>
        <div class="options-input" style="display: none">
            <label>Number of Options<span style="color: red;">*</span></label>
            <input type="number" class="num-of-options" min="1" onchange="updateQuizOptions(this)">
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

// deletes a question from the container and renumbers the questions
function deleteQuestion(button) {
  button.closest(".question").remove();
  renumberQuestions();
}

// updates the question attributes to reflect new index
function renumberQuestions() {
  const questions = document.querySelectorAll(".question");
  let newIndex = 1;

  questions.forEach((question) => {
    question.dataset.index = newIndex;
    const label = question.querySelector("label");
    if (label)
      label.innerHTML = `Question ${newIndex}<span style='color: red;'>*</span>`;

    updateNames(question, newIndex);
    newIndex++;
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

function handleQuestionTypeChange(selectedElement) {
  const questionElement = selectedElement.closest(".question");
  const type = selectedElement.value;

  const displayMap = {
    "short-answer": ".short-answer-validation",
    "long-answer": ".long-answer-validation",
    "true-false": ".true-false-options",
    "multiple-choice": ".options-input",
    checkboxes: ".options-input",
    dropdown: ".options-input",
    "file-upload": ".answer-input",
  };

  Object.values(displayMap).forEach((selector) => {
    const element = questionElement.querySelector(selector);
    if (element) element.style.display = "none";
  });

  if (type in displayMap) {
    const displayElement = questionElement.querySelector(displayMap[type]);
    if (displayElement) displayElement.style.display = "";
  }

  const isMultipleOptions = [
    "multiple-choice",
    "checkboxes",
    "dropdown",
  ].includes(type);
  questionElement.querySelector(".options-input").style.display =
    isMultipleOptions ? "" : "none";

  const isAutogradingVisible = ["file-upload", "long-answer"].includes(type);
  questionElement.querySelector(".correct-answer-label").style.display =
    isAutogradingVisible ? "none" : "";
  questionElement.querySelector(".correct-answer").style.display =
    type === "short-answer" ? "" : "none";
  questionElement.querySelector(".autograding-label").style.display =
    isAutogradingVisible ? "none" : "";
  questionElement.querySelector(".autograding").style.display =
    isAutogradingVisible ? "none" : "";

  questionElement.querySelector(".true-false-options").style.display =
    type == "true-false" ? "" : "none";
  questionElement.querySelector(".answer-checkboxes").style.display =
    type == "checkboxes" ? "" : "none";
  questionElement.querySelector(".answer-radios").style.display =
    type == "multiple-choice" ? "" : "none";
  questionElement.querySelector(".answer-dropdown").style.display =
    type == "dropdown" ? "" : "none";

  const validationSettings = questionElement.querySelector(
    ".validation-settings",
  );
  validationSettings.style.display = ["short-answer", "long-answer"].includes(
    type,
  )
    ? ""
    : "none";
}

function toggleAutograding(checkbox) {
  const answerContainer = checkbox
    .closest(".question")
    .querySelector(".answer-input");
  answerContainer.style.display = checkbox.checked ? "" : "none";
}

function updateQuizOptions(input) {
  const numberOfOptions = input.value;
  const questionElement = input.closest(".question");

  const optionClasses = [
    "options-container",
    "answer-checkboxes",
    "answer-radios",
    "answer-dropdown",
  ];
  optionClasses.forEach((optionClass) => {
    const container = questionElement.querySelector(`.${optionClass}`);
    container.innerHTML = "";
  });

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
    questionElement
      .querySelector(".answer-checkboxes")
      .appendChild(checkboxDiv);

    const radioDiv = document.createElement("div");
    radioDiv.innerHTML = `
            <label>Option ${i + 1}:</label>
            <input type="radio" name="correct-answer-${questionCount}" class="answer-radio" value=${i}>
        `;
    questionElement.querySelector(".answer-radios").appendChild(radioDiv);

    const dropdownContainer = questionElement.querySelector(".answer-dropdown");
    if (!dropdownContainer.querySelector("select")) {
      const selectElement = document.createElement("select");
      dropdownContainer.appendChild(selectElement);
    }

    const optionElement = document.createElement("option");
    optionElement.value = i + 1;
    optionElement.text = `Option ${i + 1}`;
    questionElement
      .querySelector(".answer-dropdown select")
      .appendChild(optionElement);
  }
}

async function createQuiz() {
  const quizData = createQuizData();
  console.log(JSON.stringify(quizData));

  try {
    const response = await fetch("/quiz/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizData),
    });

    if (response.ok) {
      console.log("Quiz successfully created!");
      document.getElementById("quizLink").style.display = "block";
    } else {
      console.log("Error creating quiz", response.statusText);
    }
  } catch (error) {
    console.log("Error creating quiz", error);
  }
}

function createQuizData() {
  const quizTitle = document.getElementById("title").value.trim();
  const selectedCourse = document.getElementById("course").value.trim();
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
  let alertShown = false;

  for (const question of questions) {
    if (!validateQuestion(question) && !alertShown) {
      alertShown = true;
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
        question.querySelector(".short-max-characters").value || null;
    } else if (questionType === "long-answer") {
      questionData.minCharacters =
        question.querySelector(".min-characters").value || null;
      questionData.maxCharacters =
        question.querySelector(".long-max-characters").value || null;
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
    professorId: userId,
    course: selectedCourse,
    deadline: quizDeadline || null,
    timer: totalSeconds || null,
    questions: JSON.stringify(quiz),
  };
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

function populateCourseDropDown(courses) {
  const courseSelect = document.getElementById("course");
  courses.forEach(course => {
    const option = document.createElement("option");
    option.value = course.crn;
    option.textContent = `${course.title}`;
    courseSelect.appendChild(option);
  })
}