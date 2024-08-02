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
  
  document.querySelector('.create-account-button').addEventListener('click', function() {
    window.location.href = './html/register.html';
  });
