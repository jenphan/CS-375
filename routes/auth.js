const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send('Could not log out, please try again');
            }
            res.clearCookie('connect.sid');
            return res.status(200).send('Logout successful');
        });
    } else {
        return res.status(400).send('No active session');
    }
});

router.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;
