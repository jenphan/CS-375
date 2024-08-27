const url = new URLSearchParams(window.location.search);
const quizID = url.get("quizID");
let studentId;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
    if (userCookie) {
      const decodedCookie = decodeURIComponent(userCookie.split('=')[1]);
      studentId = JSON.parse(decodedCookie).userid;
    } else {
      console.log("Not logged in – could not extract user id from cookie")
    }
  } catch (error) {
    console.log("Error while extracting user id from cookie", error)
  }

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

let timer;
let timerId;
let timerElement;

function generateQuizForm(quiz, quizQuestions) {
  timer = quiz.timer;
  timerId = setInterval(tickClock, 1000);
  const quizForm = document.getElementById("quizForm");
  const quizTitle = document.createElement("h1");
  quizTitle.textContent = quiz.quiztitle;
  quizForm.appendChild(quizTitle);

  const timerDiv = document.createElement("div");
  const timerText = document.createElement("p");
  timerText.innerHTML = `<strong>Time Left:</strong> <span id="timer">0</span>`;
  timerDiv.appendChild(timerText);
  quizForm.appendChild(timerDiv);

  timerElement = document.querySelector("#timer");
  timerElement.textContent = convertSeconds(timer);

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
  quizSubmitButton.className = "button"
  quizForm.appendChild(quizSubmitButton);

  quizSubmitButton.addEventListener("click", async () => {
    endQuiz(getSubmissionData());
  });
}

function tickClock() {
  timer--;
  timerElement.textContent = convertSeconds(timer);
  if (timer <= 0) {
    endQuiz(getSubmissionData());
  }
}

async function endQuiz(submissionData) {
  clearInterval(timerId);

  try {
    const response = await fetch("/quiz/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    });

    if (response.ok) {
      console.log("Quiz was submitted successfully!");
    } else {
      console.log("Error while submitting quiz", response.statusText);
    }
  } catch (error) {
    console.log("Error while submitting quiz", error);
  }
}

function convertSeconds(seconds) {
  const hours = Math.floor(seconds/3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const hourText = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : '';
  const minuteText = minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : '';
  const secondText = remainingSeconds > 0 ? `${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}` : '';

  if (hours > 0) {
    return `${hourText} ${minuteText || '0 minutes'} ${secondText}`;
  } else if (!hours && minutes > 0) {
    return `${minuteText} ${secondText}`;
  }
  return secondText;
}

function getSubmissionData() {
  const quizForm = document.getElementById("quizForm");
  const formData = new FormData(quizForm);
  const quizData = {};

  for (let [key, value] of formData.entries()) {
    if (!quizData[key]) {
      quizData[key] = [];
    }
    quizData[key].push(value);
  }

  const submissionData = {
    studentid: studentId,
    submission: JSON.stringify(quizData),
    quizVersion: quizID,
    submissionDate: new Date(),
  };

  return submissionData;
}