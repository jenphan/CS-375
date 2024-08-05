document.getElementById('logout-button').addEventListener('click', function() {
    fetch('/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            window.location.href = '../index.html';
        } else {
            alert('Logout failed');
        }
    }).catch(error => {
        console.error('Error:', error);
    });
});