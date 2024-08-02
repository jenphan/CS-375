document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Basic validation
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }
    let data = {
      username: username,
      password: password
    };

    fetch('auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
  
    }).then(data =>{
      console.log('Success', data);
  
    }).catch(error => {
      console.log('Error', error);
    });
  });