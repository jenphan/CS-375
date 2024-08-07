let questionCount = 0

document.getElementById('addQuestionBtn').addEventListener('click', addQuestion)
document.getElementById('createQuizBtn').addEventListener('click', createQuiz)

function addQuestion() {
    questionCount++

    const questionContainer = document.getElementById('questionsContainer')
    const questionElement = document.createElement('div')
    questionElement.className = 'question'

    questionElement.innerHTML = `
    <div class="questionSection">
        <label>Question ${questionCount}:</label>
        <select class="question-type" onchange="handleQuestionTypeChange(this)">
            <option value="short-answer">Short Answer</option>
            <option value="long-answer">Long Answer</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
            <option value="checkboxes">Checkboxes</option>
            <option value="dropdown">Dropdown</option>
            <option value="file-upload">File Upload</option>
        </select>
        <div>
            <label>Question:</label>
            <input type="text" class="question-content">
            <br>
            <label>Points:</label>
            <input type="number" class="question-points">
            <br>
            <label class="autograding-label">Automatic Grading?</label>
            <input type="checkbox" class="autograding" onchange="toggleAutograding(this)">
        </div>
        <div class="validation-settings" style="display: none">
            <div class="short-answer-validation" style="display: none">
                <label>Max Characters:</label>
                <input type="number" class="max-characters">
            </div>
            <div class="long-answer-validation" style="display: none">
                <label>Min Characters:</label>
                <input type="number" class="min-characters">
                <label>Max Characters:</label>
                <input type="number" class="max-characters">
            </div>
        </div>
        <div class="options-input" style="display: none">
            <label>Number of Options:</label>
            <input type="number" class="num-of-options" min="1" onchange="updateOptions(this)">
            <div class="options-container"></div>
        </div>
        <div class="answer-input" style="display: none">
            <label class="correct-answer-label">Correct Answer:</label>
            <input type="text" class="correct-answer">
            <div class="true-false-options" style="display: none">
                <label><input type="radio" name="true-false-${questionCount}" value="true"> True</label>
                <label><input type="radio" name="true-false-${questionCount}" value="false"> False</label>
            </div>
            <div class="answer-checkboxes" style="display: none"></div>
            <div class="answer-radios" style="display: none"></div>
            <div class="answer-dropdown" style="display: none"><select></select></div>
        </div>
        <div class="file-upload-input" style="display: none">
        </div>
    </div>
    `

    questionContainer.appendChild(questionElement)
}

function handleQuestionTypeChange(selected) {
    const questionElement = selected.closest('.question')
    const optionsContainer = questionElement.querySelector('.options-input')
    const trueFalseOptions = questionElement.querySelector('.true-false-options')
    const answerCheckboxes = questionElement.querySelector('.answer-checkboxes')
    const answerRadios = questionElement.querySelector('.answer-radios')
    const answerDropdown = questionElement.querySelector('.answer-dropdown')
    const correctAnswerLabel = questionElement.querySelector('.correct-answer-label')
    const correctAnswerInput = questionElement.querySelector('.correct-answer')
    const autogradingLabel = questionElement.querySelector('.autograding-label')
    const autogradingInput = questionElement.querySelector('.autograding')
    const fileUploadInput = questionElement.querySelector('.file-upload-input')

    const validationSettings = questionElement.querySelector('.validation-settings')
    if (validationSettings) {
        validationSettings.style.display = ['short-answer', 'long-answer'].includes(selected.value) ? '' : 'none'

        const shortAnswerValidation = questionElement.querySelector('.short-answer-validation')
        const longAnswerValidation = questionElement.querySelector('.long-answer-validation')

        shortAnswerValidation.style.display = selected.value == 'short-answer' ? '' : 'none'
        longAnswerValidation.style.display = selected.value == 'long-answer' ? '' : 'none'
    }

    const isMultipleOptions = ['multiple-choice', 'checkboxes', 'dropdown'].includes(selected.value)
    
    optionsContainer.style.display = isMultipleOptions ? '' : 'none'
    trueFalseOptions.style.display = selected.value == 'true-false' ? '' : 'none'
    answerCheckboxes.style.display = selected.value == 'checkboxes' ? '' : 'none'
    answerRadios.style.display = selected.value == 'multiple-choice' ? '' : 'none'
    answerDropdown.style.display = selected.value == 'dropdown' ? '' : 'none'
    fileUploadInput.style.display = selected.value == 'file-upload' ? '' : 'none'
    
    correctAnswerLabel.style.display = ['file-upload', 'long-answer'].includes(selected.value) ? 'none' : ''
    correctAnswerInput.style.display = selected.value === 'short-answer' ? '' : 'none'
    autogradingLabel.style.display = ['file-upload', 'long-answer'].includes(selected.value) ? 'none' : ''
    autogradingInput.style.display = ['file-upload', 'long-answer'].includes(selected.value) ? 'none' : ''
}

function toggleAutograding(checkbox) {
    const answerContainer = checkbox.closest('.question').querySelector('.answer-input')
    answerContainer.style.display = checkbox.checked ? '' : 'none'
}

function updateOptions(input) {
    const numberOfOptions = input.value
    const optionsContainer = input.closest('.options-input').querySelector('.options-container')
    const answerCheckboxes = input.closest('.question').querySelector('.answer-checkboxes')
    const answerRadios = input.closest('.question').querySelector('.answer-radios')
    const answerDropdown = input.closest('.question').querySelector('.answer-dropdown select')
    
    optionsContainer.innerHTML = ''
    answerCheckboxes.innerHTML = ''
    answerRadios.innerHTML = ''
    answerDropdown.innerHTML = ''

    for (let i = 0; i < numberOfOptions; i++) {
        const option = document.createElement('div')
        option.innerHTML = `
            <label>Option ${i + 1}:</label>
            <input type="text" class="option">
        `
        optionsContainer.appendChild(option)

        const answerCheckbox = document.createElement('div')
        answerCheckbox.innerHTML = `
            <label>Option ${i + 1}:</label>
            <input type="checkbox" class="answer-checkbox" value=${i}>
        `
        answerCheckboxes.appendChild(answerCheckbox)

        const answerRadio = document.createElement('div')
        answerRadio.innerHTML = `
            <label>Option ${i + 1}:</label>
            <input type="radio" name="correct-answer-${questionCount}" class="answer-radio" value=${i}>
        `
        answerRadios.appendChild(answerRadio)

        const answerDropdownOption = document.createElement('option')
        answerDropdownOption.value = i + 1
        answerDropdownOption.text = `Option ${i + 1}`
        answerDropdown.appendChild(answerDropdownOption)
    }
}

async function createQuiz() {
    const questions = document.querySelectorAll('.question')
    const quiz = []
    const professorId = 1414 //temporary

    questions.forEach(question => {
        const questionType = question.querySelector('.question-type').value
        const questionContent = question.querySelector('.question-content').value
        const questionPoints = question.querySelector('.question-points').value
        const autograding = question.querySelector('.autograding').checked

        const questionData = {
            type: questionType,
            content: questionContent,
            points: questionPoints,
            autograding: autograding
        }

        if (questionType === 'short-answer') {
            questionData.maxCharacters = question.querySelector('.max-characters').value
        } else if (questionType === 'long-answer') {
            questionData.minCharacters = question.querySelector('.min-characters').value
            questionData.maxCharacters = question.querySelector('.max-characters').value
        }

        if (questionType === 'short-answer') {
            questionData.correctAnswer = question.querySelector('.correct-answer').value
        } else if (questionType === 'true-false') {
            questionData.correctAnswer = question.querySelector('.true-false-options input:checked')?.value || ''
        } else if (['multiple-choice', 'checkboxes', 'dropdown'].includes(questionType)) {
            const options = []
            question.querySelectorAll('.option').forEach(option => {
                options.push(option.value)
            })

            questionData.options = options;

            if (questionType === 'multiple-choice') {
                questionData.correctAnswer = question.querySelector('.answer-radio:checked')?.value || ''
            } else if (questionType === 'checkboxes') {
                const correctAnswers = []
                question.querySelectorAll('.answer-checkbox:checked').forEach(checkbox => {
                    correctAnswers.push(checkbox.value)
                })
                questionData.correctAnswer = correctAnswers
            } else if (questionType === 'dropdown') {
                questionData.correctAnswer = question.querySelector('.answer-dropdown select').value
            }
        } else if (questionType === 'long-answer' || questionType === 'file-upload') {
            questionData.correctAnswer = ''
        }
        quiz.push(questionData)
    })

    const quizTitle = document.getElementById('title').value
    const quizDeadline = document.getElementById('deadline').value
    const quizTimer = document.getElementById('timer').value

    const quizData = {
        professorId: professorId,
        title: quizTitle,
        deadline: quizDeadline,
        time: quizTimer,
        questions: quiz
    }

    const quizJson = JSON.stringify(quizData, null, 2)

    try {
        const response = await fetch('/quiz/createquiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quizData)
        })

        if (response.ok) {
            console.log('Quiz successfully created!')
            await fetch('/quiz/savequiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: quizJson
            })
            document.getElementById('quizLink').style.display = "block"
        } else {
            console.log('Error creating quiz', response.statusText)
        }
    } catch (error) {
        console.log('Error creating quiz', error)
    }
}