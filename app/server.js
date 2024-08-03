let axios = require("axios");
const { response } = require("express");
let express = require("express");
let app = express();
let port = 3000;
let hostname = "localhost";

app.use(express.json())
app.use(express.static("../public"));

let quizzes = [];

app.post('/createquiz', (req, res) => {
    const quiz = req.body
    quizzes.push(quiz)
    console.log('Received quiz:', quiz)
    res.status(200).json({ data: quiz })
})

app.get('/createquiz', (req, res) => {
    res.json(quizzes)
})

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});