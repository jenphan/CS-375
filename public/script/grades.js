document.addEventListener("DOMContentLoaded", function () {
  fetch("/grades", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((grades) => {
      console.log("Grades:", grades); // Debugging: Check what is being returned
      const gradesBody = document.getElementById("grades-body");

      if (Array.isArray(grades) && grades.length === 0) {
        gradesBody.innerHTML =
          "<tr><td colspan='5' class='centered'>No grades found</td></tr>";
      } else {
        let lastCourseTitle = null;

        grades.forEach((grade) => {
          const row = document.createElement("tr");

          // Only show the course title if it's different from the last one
          const courseTitleCell =
            lastCourseTitle === grade.courseTitle
              ? "<td></td>"
              : `<td>${grade.courseTitle}</td>`;
          lastCourseTitle = grade.courseTitle;

          // Convert the date to a readable format
          const formattedDate = new Date(
            grade.submissiondate,
          ).toLocaleDateString();

          let gradeAmount = grade.grade;

          if (!gradeAmount) {
            gradeAmount = "In Progress";
          }

          row.innerHTML = `
              ${courseTitleCell}
              <td>${grade.quizTitle}</td>
              <td class="grade-cell" data-quiz-id="${grade.quizID}" data-submit-id="${grade.submitID}">${gradeAmount}</td>
              <td>${formattedDate}</td>
              <td>${grade.totalScore}</td>
            `;

          gradesBody.appendChild(row);
        });

        document.querySelectorAll(".grade-cell").forEach((cell) => {
          cell.addEventListener("click", async function () {
            const quizID = this.getAttribute("data-quiz-id");
            const submitID = this.getAttribute("data-submit-id");

            const quizResponse = await fetch(`/quiz/get/${quizID}`);
            const quiz = await quizResponse.json();
            const quizData = quiz[0].quiz;

            const submissionResponse = await fetch(
              `/submission/get-all-by-submitid/${submitID}`,
            );
            const submission = await submissionResponse.json();
            const submissionData = submission[0].submission;

            const modal = document.getElementById("grade-modal");
            const modalText = document.getElementById("modal-text");

            modalText.innerHTML = `<h1>Quiz Questions</h1>`;
            quizData.forEach((question, index) => {
              const questionIndex = `question-${index}`;
              const studentAnswer = submissionData[questionIndex];
              // console.log("Student Answer: " + studentAnswer);
              const correctAnswer = question.correctAnswer;
              // console.log("Correct Answer: " + correctAnswer);
              let gradingStatus = "Incomplete";

              modalText.innerHTML += `<p>${index + 1}. ${question.content}</p>`;
              modalText.innerHTML += `<p><strong>Your answer: </strong> ${studentAnswer}</p>`;
              modalText.innerHTML += `<p><strong>Graded: </strong> ${gradingStatus}</p><br>`;
            });
            modal.style.display = "block";
          });
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching grades:", error);
      const gradesBody = document.getElementById("grades-body");
      gradesBody.innerHTML =
        "<tr><td colspan='5' class='centered'>Error loading grades</td></tr>";
    });

  document
    .getElementById("close-button")
    .addEventListener("click", function () {
      document.getElementById("grade-modal").style.display = "none";
    });
});
