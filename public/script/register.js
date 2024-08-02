document.getElementById('create-account-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting
  
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const isProfessor = document.getElementById('is-professor').checked;
  
    // Basic validation
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    // Simulate account creation process
    alert(`Account created for ${username}!
  Email: ${email}
  Is Professor: ${isProfessor ? 'Yes' : 'No'}`);
  
    // Redirect to login or home page
    window.location.href = 'index.html'; // Change this to your desired page
  });