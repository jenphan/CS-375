document.getElementById('create-account-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const role = document.getElementById('register-role').value;

  if (!username || !password || !confirmPassword || !role) {
      alert('Please fill in all fields');
      return false;
  }

  // Basic validation
  if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
  }

  let data = {
      username: username,
      password: password,
      role: role
  };

  fetch('/auth/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  }).then((response) => {
      if (!response.ok) {
          return response.json().then(errorData => {
              throw new Error(errorData.message || 'Network response was not ok');
          });
      }
      return response.json();
  }).then(data => {
      console.log('Success', data);
      alert(`Registration successful for ${role}! Please log in.`);
      window.location.href = '../index.html'; // Change this to your desired page
  })
  .catch(error => {
      console.error('Error', error);
      alert(`Registration failed: ${error.message}`);
  });
});
