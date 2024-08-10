let {registerAccount, getUser} = require('../app/query');

const registerUser = async (req, res) => {
    const { username, password, role } = req.body;
    console.log(req.body);
    
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        let existingUser = getUser(username);
        if (existingUser != undefined) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        registerAccount(username, password, role); 
        
        //THIS ERROR TRAPPING NO LONGER WORKS
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await findUserByUsername(username);
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Set session data
        req.session.user = { username: user.username, role: user.type };

        res.status(200).json({ message: 'Login successful', user: { username: user.username, role: user.type } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
};