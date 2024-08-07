let axios = require("axios");
const { response } = require("express");
let express = require("express");
let session = require("express-session");

const bodyParser = require('body-parser');
const crypto = require('crypto'); // Import crypto for generating a random string
const authRoutes = require('../routes/auth');
const quizRoutes = require('../routes/quiz');
const createCourse = require('../routes/course');
const calendarRoutes = require('../routes/calendar');

let app = express();
let port = 3000;
let hostname = "localhost";

// Generate a random secret key
const secretKey = crypto.randomBytes(64).toString('hex');

// Session setup
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if using HTTPS
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("../public"));

// Routes
app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes);
app.use('/course', createCourse);
app.use('/calendar', calendarRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error' });
});

// Start server
app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});
