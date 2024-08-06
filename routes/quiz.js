const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

let quizzes = []
const quizFilePath = path.join(__dirname, 'quiz.json')

function clearQuizFile() {
    fs.writeFileSync(quizFilePath, JSON.stringify([], null, 2), 'utf-8', (err) => {
        if (err) {
            res.status(500).send('Error while clearing quiz file!', err)
        } else {
            res.status(200).send('Quiz was successfully cleared!')
        }
    })
}

clearQuizFile()

router.post('/createquiz', (req, res) => {
    const quiz = req.body
    quizzes.push(quiz)
    console.log('Received quiz:', quiz)
    res.status(200).json({ data: quiz })
})

router.post('/savequiz', (req, res) => {
    fs.writeFile(quizFilePath, JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            res.status(500).send('Error while saving quiz to file')
        } else {
            res.status(200).send('Quiz was successfully saved!')
        }
    })
})

router.get('/getquiz', (req, res) => {
    fs.readFile(quizFilePath, 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Error while reading quiz from file')
        } else {
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(JSON.parse(data))
        }
    })
})

router.get('/createquiz', (req, res) => {
    res.json(quizzes)
})

router.post('/submit', (req, res) => {
    const answers = req.body
    console.log('Received answers:', answers)
    res.status(200).json({ message: 'Quiz was submitted successfully!'})
})

module.exports = router