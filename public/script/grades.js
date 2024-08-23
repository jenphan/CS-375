document.addEventListener("DOMContentLoaded", function() {
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
          gradesBody.innerHTML = "<tr><td colspan='5' class='centered'>No grades found</td></tr>";
        } else {
          let lastCourseTitle = null;

          grades.forEach((grade, index) => {
            const row = document.createElement("tr");

            // Only show the course title if it's different from the last one
            const courseTitleCell = lastCourseTitle === grade.courseTitle ? '<td></td>' : `<td>${grade.courseTitle}</td>`;
            lastCourseTitle = grade.courseTitle;

            // Convert the date to a readable format
            const formattedDate = new Date(grade.submissiondate).toLocaleDateString();

            row.innerHTML = `
              ${courseTitleCell}
              <td>${grade.quizTitle}</td>
              <td>${grade.grade}</td>
              <td>${formattedDate}</td>
              <td>${grade.totalScore}</td>
            `;

            gradesBody.appendChild(row);
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching grades:", error);
        const gradesBody = document.getElementById("grades-body");
        gradesBody.innerHTML = "<tr><td colspan='5' class='centered'>Error loading grades</td></tr>";
      });      
});