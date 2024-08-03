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
            <option value="multiple-choice">Multiple Choice</option>
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
        <div class="options-input" style="display: none">
            <label>Number of Options:</label>
            <input type="number" class="num-of-options" min="1" onchange="updateOptions(this)">
            <div class="options-container"></div>
        </div>
        <div class="answer-input" style="display: none">
            <label class="correct-answer-label">Correct Answer:</label>
            <input type="text" class="correct-answer">
            <div class="answer-checkboxes" style="display: none"></div>
            <div class="answer-radios" style="display: none"></div>
            <div class="answer-dropdown" style="display: none"><select></select></div>
        </div>
    </div>
    `

    questionContainer.appendChild(questionElement)
}

function handleQuestionTypeChange(selected) {
    const questionElement = selected.closest('.question')
    const optionsContainer = questionElement.querySelector('.options-input')
    const answerCheckboxes = questionElement.querySelector('.answer-checkboxes')
    const answerRadios = questionElement.querySelector('.answer-radios')
    const answerDropdown = questionElement.querySelector('.answer-dropdown')
    const correctAnswerLabel = questionElement.querySelector('.correct-answer-label')
    const correctAnswerInput = questionElement.querySelector('.correct-answer')
    const autogradingLabel = questionElement.querySelector('.autograding-label')
    const autogradingInput = questionElement.querySelector('.autograding')

    const isMultipleOptions = ['multiple-choice', 'checkboxes', 'dropdown'].includes(selected.value)
    
    optionsContainer.style.display = isMultipleOptions ? '' : 'none'
    answerCheckboxes.style.display = selected.value == 'checkboxes' ? '' : 'none'
    answerRadios.style.display = selected.value == 'multiple-choice' ? '' : 'none'
    answerDropdown.style.display = selected.value == 'dropdown' ? '' : 'none'
    
    correctAnswerLabel.style.display = selected.value === 'file-upload' ? 'none' : ''
    correctAnswerInput.style.display = selected.value === 'short-answer' ? '' : 'none'
    autogradingLabel.style.display = selected.value === 'file-upload' ? 'none' : ''
    autogradingInput.style.display = selected.value === 'file-upload' ? 'none' : ''
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
            questionData.correctAnswer = question.querySelector('.correct-answer').value
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
        }
        quiz.push(questionData)
    })
}