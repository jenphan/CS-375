document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Basic validation
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }
  
    // Simulate login process
    if (username === 'admin' && password === 'password') {
      alert('Login successful!');
      // Redirect or perform other actions here
    } else {
      alert('Invalid username or password.');
    }
  });