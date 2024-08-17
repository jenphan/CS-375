document.addEventListener("DOMContentLoaded", async () => {
  const url = new URLSearchParams(window.location.search);
  const quizID = url.get("quizID");

  if (!quizID) {
    console.log("Quiz ID is missing");
    return;
  }

  try {
    const quizResponse = await fetch(`/quiz/take/${quizID}`);
    const quiz = await quizResponse.json();

    document.getElementById("courseTitle").textContent = "Course";
    document.getElementById("quizTitle").textContent = quiz.quiztitle;
    document.getElementById("deadline").textContent =
      `Deadline: ${new Date(quiz.deadline).toLocaleString()}`;

    const submissionsResponse = await fetch(`/quiz/get-submissions/${quizID}`);
    const submissionResult = await submissionsResponse.json();
    const submissions = submissionResult.rows;

    const submissionsContainer = document.getElementById(
      "submissionsContainer",
    );

    submissions.forEach((submission) => {
      const card = document.createElement("div");
      card.className = "card";

      const student = document.createElement("p");
      student.innerHTML = `<strong>Student:</strong> ${submission.studentname}`;
      card.appendChild(student);

      const grading = document.createElement("p");
      grading.innerHTML = `<p><strong>Grading:</strong> <span style="color: red">Incomplete</span></p>`;
      card.appendChild(grading);

      const submitted = document.createElement("p");
      submitted.innerHTML = `<p><strong>Submitted:</strong> ${new Date(submission.submissiondate).toLocaleString()} ${submission.submissiondate > submission.deadline ? "(<span style='color: red'>Late</span>)" : ""}</p>`;
      card.appendChild(submitted);

      submissionsContainer.appendChild(card);
    });
  } catch (error) {
    console.log("Error while fetching submissions", error);
  }
});
