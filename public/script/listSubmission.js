document.addEventListener("DOMContentLoaded", async function () {
    const quizID = 1; // Replace with the actual quizID you want to check
    try {
        const response = await fetch(`/quiz/getSubmissions/${quizID}`);
        const submissions = await response.json();

        const table = document.getElementById('submissionsTable');

        // Create the table header
        const thead = table.createTHead();
        const headerRow = thead.insertRow();

        const headers = ["Submission ID", "Student ID", "Submission", "Quiz Version"];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        // Populate the table with submission data
        const tbody = table.createTBody();
        if (submissions.length > 0) {
            submissions.forEach(submission => {
                const row = tbody.insertRow();

                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                const cell4 = row.insertCell(3);

                cell1.textContent = submission.submitid;
                cell2.textContent = submission.student;
                if(submission.submission){
                    cell3.textContent = "Submitted";
                }
                else{
                    cell3.textContent = "No submission";
                }
                cell4.textContent = submission.quizversion;
            });
        } else {
            const row = tbody.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 4;
            cell.textContent = "No submissions found for this quiz.";
            cell.style.textAlign = "center";
        }
    } catch (error) {
        console.error('Error fetching submissions:', error);
    }
});
