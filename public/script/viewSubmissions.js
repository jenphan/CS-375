document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get("quizID");

  if (!quizId) {
    console.log("Quiz ID is missing");
    return;
  }

  try {
    // fetch the quiz details
    const quizResponse = await fetch(`/quiz/take/${quizId}`);
    const quiz = await quizResponse.json();

    // update the quiz details on submissions page
    document.getElementById("courseTitle").textContent = "Course";
    document.getElementById("quizTitle").textContent = quiz.quiztitle;
    document.getElementById("deadline").textContent =
      `Deadline: ${new Date(quiz.deadline).toLocaleString()}`;

    // fetch the submissions details
    const submissionsResponse = await fetch(`/submission/list-all/${quizId}`);
    const submissionResult = await submissionsResponse.json();
    const submissions = submissionResult.rows;

    displaySubmissions(submissions);
  } catch (error) {
    console.log("Error while fetching submissions", error);
  }
});

// Creates and appends submission cards to the submissions container
function displaySubmissions(submissions) {
  const submissionsContainer = document.getElementById("submissionsContainer");

  submissions.forEach((submission) => {
    const card = document.createElement("div");
    card.className = "card";

    // create and append student name
    const student = document.createElement("p");
    student.innerHTML = `<strong>Student:</strong> ${submission.studentname}`;
    card.appendChild(student);

    // create and append grading status - HARDCODED
    const grading = document.createElement("p");
    grading.innerHTML = `<strong>Grading:</strong> <span style="color: red">Incomplete</span>`;
    card.appendChild(grading);

    // create and append submission date
    const submitted = document.createElement("p");
    submitted.innerHTML = `<strong>Submitted:</strong> ${new Date(submission.submissiondate).toLocaleString()} ${submission.submissiondate > submission.deadline ? "(<span style='color: red'>Late</span>)" : ""}`;
    card.appendChild(submitted);

    // append card to submissions container
    submissionsContainer.appendChild(card);
  });
}
