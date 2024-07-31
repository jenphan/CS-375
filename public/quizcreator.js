let questionCount = 0

document.getElementById('addQuestionBtn').addEventListener('click', addQuestion)
document.getElementById('createQuizBtn').addEventListener('click', async () => {

})

function addQuestion() {
    questionCount++
    const questionContainer = document.getElementById('questionsContainer')
    const questionElement = document.createElement('div')
    questionElement.className = 'question'

    questionElement.innerHTML = `
    <label>Question ${questionCount}:</label>
    <select class="question-type" onchange="handleQuestionTypeChange(this)">
        <option value="short-answer">Short Answer</option>
        <option value="multiple-choice">Multiple Choice</option>
        <option value="checkboxes">Checkboxes</option>
        <option value="dropdown">Dropdown</option>
        <option value="file-upload">File Upload</option>
    </select>
    <br>
    <label>Question:</label>
    <input type="text" class="question-content">
    <br>
    <label>Points:</label>
    <input type="number" class="question-points">
    <br>
    <label class="autograding-label">Automatic Grading?</label>
    <input type="checkbox" class="autograding" onchange="toggleAutograding(this)">
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
    <br><br>
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

    const multipleOptions = ['multiple-choice', 'checkboxes', 'dropdown']
    optionsContainer.style.display = multipleOptions.includes(selected.value) ? '' : 'none'
    answerCheckboxes.style.display = selected.value == 'checkboxes' ? '' : 'none'
    answerRadios.style.display = selected.value == 'multiple-choice' ? '' : 'none'
    answerDropdown.style.display = selected.value == 'dropdown' ? '' : 'none'
    
    if (multipleOptions.includes(selected.value)) {
        correctAnswerLabel.style.display = ''
        correctAnswerInput.style.display = 'none'
        autogradingLabel.style.display = ''
        autogradingInput.style.display = ''
    } else if (selected.value == 'file-upload') {
        correctAnswerLabel.style.display = 'none'
        correctAnswerInput.style.display = 'none'
        autogradingLabel.style.display = 'none'
        autogradingInput.style.display = 'none'
    } else {
        correctAnswerLabel.style.display = ''
        correctAnswerInput.style.display = ''
        autogradingLabel.style.display = ''
        autogradingInput.style.display = ''
    }
}

function toggleAutograding(checkbox) {
    const question = checkbox.closest('.question')
    const answerContainer = question.querySelector('.answer-input')
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
            <br>
        `
        optionsContainer.appendChild(option)

        const answerCheckbox = document.createElement('div')
        answerCheckbox.innerHTML = `
            <label>Option ${i + 1}:</label>
            <input type="checkbox" class="answer-checkbox" value=${i + 1}>
            <br>
        `
        answerCheckboxes.appendChild(answerCheckbox)

        const answerRadio = document.createElement('div')
        answerRadio.innerHTML = `
            <label>Option ${i + 1}:</label>
            <input type="radio" name="correct-answer-${questionCount}" class="answer-radio" value=${i + 1}>
            <br>
        `
        answerRadios.appendChild(answerRadio)

        const answerDropdownOption = document.createElement('option')
        answerDropdownOption.value = i + 1
        answerDropdownOption.text = `Option ${i + 1}`
        answerDropdown.appendChild(answerDropdownOption)
    }
}