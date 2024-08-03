document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            if (!username || !password) {
                alert('Please fill in both fields');
                event.preventDefault();
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const role = document.getElementById('register-role').value;

            if (!username || !password || !role) {
                alert('Please fill in all fields');
                event.preventDefault();
            }
        });
    }
});
