const express = require('express')
const router = express.Router()

let quizzes = []

router.post('/createquiz', (req, res) => {
    const quiz = req.body
    quizzes.push(quiz)
    console.log('Received quiz:', quiz)
    res.status(200).json({ data: quiz })
})

router.get('./createquiz', (req, res) => {
    res.json(quizzes)
})

module.exports = router