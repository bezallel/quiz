
const startBtn = document.querySelector('.start-btn');
const guideInfo = document.querySelector('.guide-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');
const resultBox = document.querySelector('.result-box');
const tryAgainBtn = document.querySelector('.tryAgain-btn');
const goHomeBtn = document.querySelector('.goHome-btn');


function disableBrowserBack() {
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', function () {
        window.history.pushState(null, null, window.location.href);
    });
}

// Function to enable browser back navigation
function enableBrowserBack() {
    window.removeEventListener('popstate', function () {});
}

function confirmExit(e) {
    if (quizStarted) {
        e.preventDefault();
        e.returnValue = "Well well well...so you've decided to chicken out abi?";
    }
}

// Register the confirmExit function for the beforeunload event
window.addEventListener('beforeunload', confirmExit);

// Add a flag to track whether the quiz has started
let quizStarted = false;

// Event handler for starting the quiz
startBtn.onclick = () => {
    guideInfo.classList.add('active');  
    main.classList.add('active');  

    // Disable browser back when the quiz starts
    disableBrowserBack();
    quizStarted = true; // Set quizStarted to true
}

exitBtn.onclick = () => {
    guideInfo.classList.remove('active');  
    main.classList.remove('active');  

    // Enable browser back when exiting
    enableBrowserBack();
}

continueBtn.onclick = () => {
    quizSection.classList.add('active');  
    guideInfo.classList.remove('active');  
    main.classList.remove('active');  
    quizBox.classList.add('active');
    
    showQuestions(0);
    questionCounter(1);
    headerScore();

    // Disable browser back when continuing
    disableBrowserBack();
}

tryAgainBtn.onclick = () => {
    quizBox.classList.add('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');

    questionCount = 0; 
    questionNumb = 1;
    userScore = 0; 

    showQuestions(questionCount);
    questionCounter(questionNumb);

    headerScore();

    // Enable browser back when trying the quiz again
    enableBrowserBack();
}

goHomeBtn.onclick = () => {
    quizSection.classList.remove('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');

    let questionCount = 0;
    let questionNumb = 1;
    let userScore = 0;
    showQuestions(questionCount);
    questionCounter(questionNumb);

    // Enable browser back when going back home
    enableBrowserBack();
}

let questionCount = 0;
let questionNumb = 1;
let userScore = 0;

const nextBtn = document.querySelector('.next-btn');

nextBtn.onclick = () => {
    if (questionCount < questions.length - 1) {
        questionCount++;
        showQuestions(questionCount);

        questionNumb++;
        questionCounter(questionNumb);

        nextBtn.classList.remove('active');
    }
    else {
        showResultBox();
    }
}

const optionList = document.querySelector('.option-list');

// getting questions and option from array
function showQuestions(index) {
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;

    let optionTag = '';

    // Iterate through the options and create option elements
    for (let i = 0; i < questions[index].options.length; i++) {
        optionTag += `<div class="option"><span>${questions[index].options[i]}</span></div>`;
    }

    optionList.innerHTML = optionTag;

    const option = document.querySelectorAll('.option');
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute('onclick', 'optionSelected(this)');
    }
}

function optionSelected(answer) {
    let userAnswer = answer.textContent;
    let correctAnswer = questions[questionCount].answer;
    let allOptions = optionList.children.length;

    if (userAnswer == correctAnswer) {
        answer.classList.add('correct');
        userScore += 1;
        headerScore();
    }
    else {
        answer.classList.add('Incorrect');

        // highlight correct answer when user selects wrong option

        for (let i = 0; i < allOptions; i++) {
            if (optionList.children[i].textContent == correctAnswer) {
                optionList.children[i].setAttribute('class', 'option correct');
            }
        }

    }



    // disable other options once user has selected an option
    for (let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add('disabled');
    }

    nextBtn.classList.add('active');
}

function questionCounter(index) {
    const questionTotal = document.querySelector('.question-total');
    questionTotal.textContent = `${index} of ${questions.length} Questions`;
}


function headerScore() {
    const headerScoreText = document.querySelector('.header-score');
    headerScoreText.textContent = `Score: ${userScore} / ${questions.length}`;
}

function showResultBox() {
    quizBox.classList.remove('active');
    resultBox.classList.add('active');

    const scoreText = document.querySelector('.score-text');
    scoreText.textContent = `You Scored ${userScore} out of ${questions.length}`;

    const circularProgress = document.querySelector('.circular-progress');
    const ProgressValue = document.querySelector('.progress-value');

    let ProgressStartValue = 0; // Start the progress animation from 0
    const ProgressEndValue = (userScore / questions.length) * 100;

    const speed = 20;

    const animateProgress = () => {
        const interval = setInterval(() => {
            if (ProgressStartValue < ProgressEndValue) {
                ProgressStartValue++;
                ProgressValue.textContent = `${ProgressStartValue.toFixed(0)}%`;
    
                // Determine the color based on score ranges
                let color;
                if (ProgressStartValue >= 80) {
                    color = '#084e17'; // Green color for scores 80% and above
                } else if (ProgressStartValue >= 50) {
                    color = '#788408'; // yellow color for scores between 50% and 79%
                } else {
                    color = '#960606'; // Red color for scores below 50%
                }
    
                circularProgress.style.background = `conic-gradient(${color} ${ProgressStartValue * 3.6}deg, rgba(255, 255, 255, .1) 0deg)`;
            } else {
                clearInterval(interval);
            }
        }, speed);
    };

    animateProgress(); // Start the progress animation

    // Delay to ensure proper display of the animation
    setTimeout(animateProgress, 500);
}