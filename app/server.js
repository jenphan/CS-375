let axios = require("axios");
const { response } = require("express");
let express = require("express");
let app = express();
let port = 3000;
let hostname = "localhost";
app.use(express.static("../public"));

let quizzes = [];

app.post('/createquiz', (req, res) => {
    const quiz = req.body
    quizzes.push(quiz)
    res.status(200).json(quiz)
})

app.get('/createquiz', (req, res) => {
    res.json(quiz)
})

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});