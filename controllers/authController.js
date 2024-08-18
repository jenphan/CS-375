let { registerAccount, getLogin } = require('../app/query');

const registerUser = async (req, res) => {
    const { username, password, role } = req.body;
    console.log(req.body);
    
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    registerAccount(username, password, role, req, res); 
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const result = await getLogin(username, password, req, res);

        if (result) {
            console.log(`Login successful for user: ${result.username} with role: ${result.role}`);

            req.session.user = {
                userid: result.usrid,
                username: result.username,
                role: result.role
            };

            // Set the cookie with user information
            res.cookie('user', JSON.stringify({ userid: result.usrid, role: result.role }), { 
                httpOnly: false, // Allows JavaScript to access the cookie
                path: '/', // Make sure the cookie is available on all routes
            });

            // Redirect based on role
            if (result.role === 'professor') {
                return res.redirect('/html/professor.html');
            } else if (result.role === 'student') {
                return res.redirect('/html/student.html');
            } else {
                console.log("Unknown role detected");
                return res.status(400).json({ message: 'Unknown role' });
            }
        } else {
            console.log("Invalid login attempt");
            return res.status(400).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.log("Error during login:", error);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'User not found' });
        }
    }
};

module.exports = {
    registerUser,
    loginUser,
};
