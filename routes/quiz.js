const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

const { Pool } = require('pg');
const envConfig = JSON.parse(fs.readFileSync('../env.json', 'utf8'));

const pool = new Pool({
    user: envConfig.DATABASE_USER,
    host: envConfig.DATABASE_HOST,
    database: envConfig.DATABASE_NAME,
    password: envConfig.DATABASE_PASSWORD,
    port: envConfig.DATABASE_PORT,
});

let quizzes = []
const quizFilePath = path.join(__dirname, 'quiz.json')

function clearQuizFile() {
    fs.writeFileSync(quizFilePath, JSON.stringify([], null, 2), 'utf-8')
}

clearQuizFile()

router.post('/createquiz', async (req, res) => {
    const { title, professorId, deadline, timer, quiz }  = req.body

    console.log('Request body', req.body)
    try {
        const result = await pool.query(
            'INSERT INTO quizzes (title, professorid, deadline, timer) VALUES ($1, $2, $3, $4) RETURNING quizid',
            [title, professorId, deadline, timer]
        )
        const quizId = result.rows[0].quizId

        for (const question of quiz) {
            const { type, content, points, autograding, maxCharacters, minCharacters, options, correctAnswer } = question
            const questionOptions = ['multiple-choice', 'checkboxes', 'dropdown'].includes(type) ? options : null
            const questionAnswers = ['multiple-choice', 'checkboxes', 'dropdown', 'true-false'].includes(type) ? correctAnswer : null

            const insertQuestion = await pool.query(
                'INSERT INTO quiz_questions (quizid, type, content, points, autograding, max_characters, min_characters, options, answers) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING questionid',
                [quizId, type, content, points, autograding, maxCharacters || null, minCharacters || null, questionOptions, questionAnswers]
            )
            const questionId = insertQuestion.rows[0].questionid
        }
        res.status(200).json({quizId})
    } catch (error) {
        console.log('Error while creating quiz', error)
        res.status(500).json({message: 'Error while creating quiz'})
    }
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

router.get('/get-quizzes-calendar', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM quizzes');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error while fetching quizzes', error);
        res.status(500).json({ message: 'Error while fetching quizzes' });
    }
});

router.get('/createquiz', (req, res) => {
    res.json(quizzes)
})

router.post('/submit', async (req, res) => {
    const { quizId, studentId, response } = req.body
    try {
        await pool.query(
            'INSERT INTO quiz_responses (quizid, studentid, responsejson) VALUES ($1, $2, $3)',
            [quizId, studentId, response]
        )
        res.status(200).json({ message: 'Quiz was submitted successfully'})
    } catch (error) {
        console.log('Error while submitting quiz:', error)
        res.status(500).json({ message: 'Error while submitting quiz' })
    }
})

module.exports = router
