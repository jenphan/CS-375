const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", (req, res) => {
  if (req.session) {
    res.clearCookie('user');
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Could not log out, please try again");
      }
      res.clearCookie("connect.sid");
      return res.status(200).send("Logout successful");
    });
  } else {
    return res.status(400).send("No active session");
  }
});

router.get("/check-session", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// handle the home redirection based on role
router.get("/home", (req, res) => {
  if (req.session.user) {
    const role = req.session.user.role;
    if (role === 'professor') {
      return res.redirect("/html/professor.html");
    } else if (role === 'student') {
      return res.redirect("/html/student.html");
    } else {
      return res.redirect("/"); // default to home if the role is unrecognized
    }
  } else {
    return res.redirect("/"); // redirect to home if not logged in
  }
});

module.exports = router;