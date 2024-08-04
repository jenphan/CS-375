let axios = require("axios");
const { response } = require("express");
let express = require("express");

const bodyParser = require('body-parser');
const authRoutes = require('../routes/auth');
const quizRoutes = require('../routes/quiz');
const createCourse = require('../routes/course');

let app = express();
let port = 3000;
let hostname = "localhost";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("../public"));

// Routes
app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes)
app.use('/course', createCourse);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error' });
});

// Start server
app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});