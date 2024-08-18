let button = document.getElementById("grade");
let submit = document.getElementById("submitGrades");
let totalGradeDisplay = document.getElementById("totalGrade"); 
let commentInput = document.getElementById("comment"); 

const url = new URLSearchParams(window.location.search);
const quizID = url.get("quizID");
const submitID = url.get("submitID");

submit.disabled = true;
submit.style.visibility = "hidden";

button.disabled = false;

button.addEventListener("click", async () => {
  button.style.visibility = "hidden";
  button.disabled = true;
  try {
    const quizResponse = await fetch(`/quiz/getquiz/${quizID}`);
    const quiz = await quizResponse.json();

    const submissionResponse = await fetch(`/quiz/getSubmissionByID/${submitID}`);
    const submission = await submissionResponse.json();

    const autoScore = autoGrade(quiz[0], submission[0]);
    manualGrade(quiz[0], submission[0]).then((manualScore) => {
      const totalScore = autoScore + manualScore;
      totalGradeDisplay.textContent = `Total Grade: ${totalScore}`;
      fetch("/quiz/addGrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submitID: submitID, totalScore: totalScore })
      })
      .then(result => {
        return result.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      })
      clicked = true;
    });
  } catch (error) {
    console.error("Error fetching quiz or submission data:", error);
  };


});

function autoGrade(quizData, submission) {
  let totalScore = 0;
  quizData.quiz.forEach((question, index) => {
    if (question.autograding) {
      const response = submission.submission[`question-${index}`];
      if (response && response[0] === question.correctAnswer) {
        totalScore += parseInt(question.points);
      }
    }
  });

  return totalScore;
}

function manualGrade(quizData, submission) {
  return new Promise((resolve) => {
    let totalScore = 0;
    let manualGradingRequired = false;

    quizData.quiz.forEach((question, index) => {
      if (!question.autograding) {
        manualGradingRequired = true;
        const response = submission.submission[`question-${index}`];

        createGradingForm(question, response, index);
      }
    });

    if (manualGradingRequired) {
      submit.disabled = false;
      submit.style.visibility = "visible";

      submit.addEventListener("click", () => {
        quizData.questions.forEach((question, index) => {
          if (!question.autograding) {
            const gradeInput = document.getElementById(`grade-${index}`);
            const grade = gradeInput.value ? parseInt(gradeInput.value) : 0;
            totalScore += grade;
          }
        });
        const comment = commentInput.value;
        // Save grading and comment (e.g., send to server or process further)
        resolve(totalScore);
      });
    } else {
      resolve(totalScore);
    }
  });
}

function createGradingForm(question, response, index) {
  const form = document.getElementById("gradingForm");
  const questionDiv = document.createElement("div");
  questionDiv.className = "question";

  const questionLabel = document.createElement("label");
  questionLabel.textContent = `Question ${index + 1}: ${question.content}`;
  questionDiv.appendChild(questionLabel);

  const responseTextarea = document.createElement("textarea");
  responseTextarea.value = response;
  responseTextarea.readOnly = true;
  questionDiv.appendChild(responseTextarea);

  const gradeLabel = document.createElement("label");
  gradeLabel.textContent = `Grade (Max ${question.points}):`;
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
