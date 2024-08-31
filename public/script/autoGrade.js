let button = document.getElementById("grade");
let submit = document.getElementById("submitGrades");
let totalGradeDisplay = document.getElementById("autoGrade");
let finalGradeDisplay = document.getElementById("finalGrade");
let commentInput = document.getElementById("comment");

const url = new URLSearchParams(window.location.search);
const quizID = url.get("quizID");
const submitID = url.get("submitID");

submit.disabled = true;
submit.style.visibility = "hidden";

button.disabled = false;

window.addEventListener("load", async () => {
  try {
    const quizResponse = await fetch(`/quiz/get/${quizID}`);
    const quiz = await quizResponse.json();

    const submissionResponse = await fetch(
      `/submission/get-all-by-submitid/${submitID}`,
    );
    const submission = await submissionResponse.json();

    quiz[0].quiz.forEach((question, index) => {
      createGradingForm(
        question,
        submission[0].submission[`question-${index}`],
        submission[0].imageid,
        index,
      );
    });
  } catch (error) {
    console.error("Error fetching quiz or submission data:", error);
  }
});

button.addEventListener("click", () => {
  button.style.visibility = "hidden";
  button.disabled = true;

  const quizData = document.querySelectorAll(".question");
  let totalScore = 0;

  quizData.forEach((questionDiv, index) => {
    const isAutoGrade = questionDiv.dataset.autograding === "true";
    const responseTextarea = questionDiv.querySelector("textarea");
    const correctAnswer = questionDiv.dataset.correctAnswer;
    const points = parseInt(questionDiv.dataset.points);

    if (isAutoGrade) {
      const response = responseTextarea.value;
      const result = response === correctAnswer ? "Correct" : "Incorrect";
      responseTextarea.nextElementSibling.textContent = result;

      if (response === correctAnswer) {
        totalScore += points;
      }
    }
  });

  totalGradeDisplay.textContent = `Total Auto Grade: ${totalScore}`;
  submit.disabled = false;
  submit.style.visibility = "visible";
});

submit.addEventListener("click", () => {
  const quizData = document.querySelectorAll(".question");
  let finalScore = 0;

  quizData.forEach((questionDiv, index) => {
    const isAutoGrade = questionDiv.dataset.autograding === "true";
    const points = parseInt(questionDiv.dataset.points);

    if (isAutoGrade) {
      const responseTextarea = questionDiv.querySelector("textarea");
      const correctAnswer = questionDiv.dataset.correctAnswer;
      if (responseTextarea.value === correctAnswer) {
        finalScore += points;
      }
    } else {
      const gradeInput = document.getElementById(`grade-${index}`);
      const manualScore = gradeInput.value ? parseInt(gradeInput.value) : 0;
      finalScore += manualScore;
    }
  });

  finalGradeDisplay.textContent = `Final Grade: ${finalScore}`;
  fetch("/submission/add-grade", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ submitID: submitID, finalScore: finalScore }),
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  console.log(commentInput.value);
  fetch("/submission/add-comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ submitID: submitID, comment: commentInput.value }),
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

async function createGradingForm(question, response, imageid, index) {
  const form = document.getElementById("gradingForm");
  const questionDiv = document.createElement("div");
  questionDiv.className = "question";
  questionDiv.dataset.autograding = question.autograding;
  questionDiv.dataset.correctAnswer = question.correctAnswer;
  questionDiv.dataset.points = question.points;

  const questionLabel = document.createElement("label");
  questionLabel.textContent = `Question ${index + 1}: ${question.content}`;
  questionDiv.appendChild(questionLabel);

  if (imageid != null) {
      const image = document.createElement("img");
      image.src = `../image/${imageid}`; 
      image.alt = `Uploaded Image for Question ${index + 1}`;
      image.style.maxWidth = "100%";
      image.style.maxHeight = "300px"; 
      questionDiv.appendChild(image);
  } else {
      const responseTextarea = document.createElement("textarea");
      responseTextarea.value = response;
      responseTextarea.readOnly = true;
      questionDiv.appendChild(responseTextarea);
  }

  const gradeLabel = document.createElement("label");
  gradeLabel.textContent = "Grade:";
  questionDiv.appendChild(gradeLabel);

  const gradeInput = document.createElement("input");
  gradeInput.type = "number";
  gradeInput.min = "0";
  gradeInput.max = question.points;
  gradeInput.step = "1";
  gradeInput.id = `grade-${index}`;
  questionDiv.appendChild(gradeInput);

  form.appendChild(questionDiv);
}

