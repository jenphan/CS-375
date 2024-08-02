document.getElementById('create-course-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting
  
    const courseName = document.getElementById('course-name').value;
    const subjectCode = document.getElementById('subject-code').value;
    const courseNumber = document.getElementById('course-number').value;
    const crn = document.getElementById('crn').value;

    if (!courseName || !subjectCode || !courseNumber || !crn) {
      alert('Please fill in all fields');
      return false;
  }
  
    alert(`${courseName} is created!`);
    console.log("ok\n");
    window.location.href = './prof.html';
  });