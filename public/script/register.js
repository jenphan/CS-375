document.getElementById('create-account-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting
  
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const role = document.getElementById('register-role').value;

    if (!username || !email || !password || !confirmPassword || !role) {
      alert('Please fill in all fields');
      return false;
  }
    // Basic validation
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    // Simulate account creation process
    alert(`Account created for ${username}!
    Email: ${email}
    Role: ${role}`);
    console.log("ok\n");
    // Redirect to login or home page
    window.location.href = '../index.html'; // Change this to your desired page
  });