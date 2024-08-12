let {registerAccount, getLogin} = require('../app/query');


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

    getLogin(username, password, req, res);
        
};

module.exports = {
    registerUser,
    loginUser,
};