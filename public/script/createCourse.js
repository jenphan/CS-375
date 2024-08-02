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
    if (isNaN(subjectCode)) {
        alert('Subject code must be a number');
        return false;
    }
    if (isNaN(courseNumber)) {
        alert('Course number must be a number');
        return false;
    }
    if (isNaN(crn)) {
        alert('CRN must be a number');
        return;
    }

    if (courseName.length > 50) {
      alert('Course name is too long');
      return false;
    }
    if (subjectCode.length > 5) {
        alert('Subject code is too long');
        return false;
    }
    if (courseNumber.length > 3) {
        alert('Course number is too long');
        return false;
    }
    if (crn.length != 5) {
        alert('CRN must be 5 digits');
        return false;
    }
  
    alert(`${courseName} has been created!`);
    console.log("ok\n");
    window.location.href = './prof.html';
  });