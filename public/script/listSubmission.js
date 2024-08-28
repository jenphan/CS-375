document.addEventListener("DOMContentLoaded", async function () {
  let creator;
  try {
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));
    if (userCookie) {
      const decodedCookie = decodeURIComponent(userCookie.split("=")[1]);
      creator = JSON.parse(decodedCookie).userid;
    } else {
      console.log("Not logged in – could not extract user id from cookie");
    }
  } catch (error) {
    console.log("Error while extracting user id from cookie", error);
  }

  try {
    const response = await fetch(`/quiz/get-all-by-creator/${creator}`);
    const quizzes = await response.json();

    const table = document.getElementById("submissionsTable");

    // Create the table header
    const thead = table.querySelector("thead");
    const headerRow = thead.insertRow();
    const headers = ["Submission ID", "Student", "Student ID"];
    quizzes.forEach((quiz) => {
      headers.push(`${quiz.title}`);
    });
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    // Track the latest submission for each student
    // Create the table body
    const tbody = table.querySelector("tbody");
    const latestSubmissions = {};

    for (const quiz of quizzes) {
      try {
        const response = await fetch(
          `/submission/get-all-by-quizid/${quiz.quizid}`,
        );
        const submissions = await response.json();

        // Iterate over the submissions and store only the latest one for each student
        submissions.forEach((submission) => {
          const studentID = submission.student;
          const submitID = submission.submitid;

          if (!latestSubmissions[studentID]) {
            latestSubmissions[studentID] = {};
          }

          if (
            !latestSubmissions[studentID][quiz.quizid] ||
            latestSubmissions[studentID][quiz.quizid].submitid < submitID
          ) {
            latestSubmissions[studentID][quiz.quizid] = submission;
          }
        });
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    }

    const studentIDs = Object.keys(latestSubmissions);

    if (studentIDs.length > 0) {
      for (const studentID of studentIDs) {
        const row = tbody.insertRow();

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.textContent =
          latestSubmissions[studentID][
            Object.keys(latestSubmissions[studentID])[0]
          ].submitid;
        const getStudent = await fetch(`/quiz/getUserByID/${studentID}`);
        const result = await getStudent.json();
        cell2.textContent = result.username;
        cell3.textContent = studentID;

        quizzes.forEach((quiz) => {
          const cell = row.insertCell();
          const submission = latestSubmissions[studentID][quiz.quizid];

          if (submission && submission.submission) {
            cell.textContent = "Submitted";
            cell.classList.add("clickable");
            cell.addEventListener("click", function () {
              window.location.href = `/html/grading.html?quizID=${quiz.quizid}&submitID=${submission.submitid}`;
            });
          } else {
            cell.textContent = "No submission";
          }
          if (submission.grade != null) {
            cell.textContent = submission.grade;
          }
        });
      }
    } else {
      const row = tbody.insertRow();
      const cell = row.insertCell(0);
      cell.colSpan = 3 + quizzes.length;
      cell.textContent = "No submissions found.";
      cell.style.textAlign = "center";
    }
  } catch (error) {
    console.log("Error fetching quizzes", error);
  }
});
