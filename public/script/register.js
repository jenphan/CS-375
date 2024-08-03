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
    //   window.location.href = '../index.html'; // Change this to your desired page
  })
  .catch(error => {
      console.error('Error', error);
      alert(`Registration failed: ${error.message}`);
  });
});

const toggleCheckbox = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Load saved theme preference or apply system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    toggleCheckbox.checked = savedTheme === 'dark';
} else if (prefersDarkScheme.matches) {
    document.body.classList.add('dark-mode');
    toggleCheckbox.checked = true;
}

// Toggle theme and save preference
toggleCheckbox.addEventListener('change', () => {
    if (toggleCheckbox.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    }
});