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
    <select class="question-type">
        <option value="short-answer">Short Answer</option>
        <option value="multiple-choice">Multiple Choice</option>
        <option value="checkboxes">Checkboxes</option>
        <option value="dropdown">Dropdown</option>
        <option value="file-upload">File Upload</option>
    </select>
    <br>
    <label>Question:</label>
    <input type="text" class="question-content>
    <br>
    <label>Points:</label>
    <input type="number" class="question-points">
    <br>
    <label>Automatic Grading?</label>
    <input type="checkbox" class="autograding">
    <div class="options-input" style="display: none">
        <label>Number of Options:</label>
        <input type="number" class="num-of-options" min="1">
        <div class="options-container"></div>
    </div>
    <div class="answers-input" style="display: none">
        <label>Correct Answer:</label>
        <input type="text" class="correct-answer">
    </div>
    <br><br>
    `

    questionContainer.appendChild(questionElement)
}